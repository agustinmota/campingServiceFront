import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, RefreshCw, Save, Trash2, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createResource, deleteResource, fetchResource, updateResource } from "../features/resources/resourceSlice";
import { confirmDelete } from "./confirmDelete";

function fileToImageDataUrl(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const imageUrl = URL.createObjectURL(file);

    image.onload = () => {
      const maxSize = 1400;
      const ratio = Math.min(1, maxSize / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * ratio);
      canvas.height = Math.round(image.height * ratio);

      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(imageUrl);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };

    image.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error("Could not read image file"));
    };

    image.src = imageUrl;
  });
}

export function ResourcePage({ resource, title, description, columns, fields, emptyText, canManage = true, getItemHref }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((state) => state.resources[resource]);
  const status = useSelector((state) => state.resources.status[resource] || "idle");
  const error = useSelector((state) => state.resources.errors[resource]);
  const initialForm = useMemo(
    () => Object.fromEntries(fields.map((field) => [field.name, field.defaultValue || ""])),
    [fields]
  );
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(initialForm);

  useEffect(() => {
    dispatch(fetchResource(resource));
  }, [dispatch, resource]);

  const handleChange = async (event) => {
    const { name, value, type, files } = event.target;
    if (type === "file") {
      const file = files?.[0];
      if (!file) {
        return;
      }
      const imageDataUrl = await fileToImageDataUrl(file);
      setForm((current) => ({ ...current, [name]: imageDataUrl }));
      return;
    }

    setForm((current) => ({ ...current, [name]: type === "number" ? Number(value) : value }));
  };

  const handleEditChange = async (event) => {
    const { name, value, type, files } = event.target;
    if (type === "file") {
      const file = files?.[0];
      if (!file) {
        return;
      }
      const imageDataUrl = await fileToImageDataUrl(file);
      setEditForm((current) => ({ ...current, [name]: imageDataUrl }));
      return;
    }

    setEditForm((current) => ({ ...current, [name]: type === "number" ? Number(value) : value }));
  };

  const startEditing = (item) => {
    setEditingId(item.id);
    setEditForm(Object.fromEntries(fields.map((field) => [field.name, item[field.name] ?? field.defaultValue ?? ""])));
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm(initialForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(createResource({ resource, values: form }));
    if (createResource.fulfilled.match(result)) {
      setForm(initialForm);
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(updateResource({ resource, id: editingId, values: editForm }));
    if (updateResource.fulfilled.match(result)) {
      cancelEditing();
    }
  };

  const goToItem = (item) => {
    if (!canManage && getItemHref) {
      navigate(getItemHref(item));
    }
  };

  const handleItemKeyDown = (event, item) => {
    if (!canManage && getItemHref && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      goToItem(item);
    }
  };

  const handleDelete = (item) => {
    if (confirmDelete(resource === "cabins" ? "cabin" : "campsite")) {
      dispatch(deleteResource({ resource, id: item.id }));
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <button className="icon-button" type="button" title="Refresh" onClick={() => dispatch(fetchResource(resource))}>
          <RefreshCw size={18} />
        </button>
      </div>

      <div className={canManage ? "work-grid" : "resource-user-layout"}>
        {canManage ? (
          <form className="panel form compact-form" onSubmit={handleSubmit}>
            <h2>New record</h2>
            {fields.map((field) => (
              <label key={field.name}>
                {field.label}
                {field.type === "file" ? (
                  <>
                    <input
                      accept={field.accept || "image/*"}
                      name={field.name}
                      type="file"
                      onChange={handleChange}
                      required={field.required !== false && !form[field.name]}
                    />
                    {form[field.name] ? <img className="upload-preview" src={form[field.name]} alt="Selected upload preview" /> : null}
                  </>
                ) : (
                  <input
                    name={field.name}
                    type={field.type || "text"}
                    value={form[field.name]}
                    min={field.min}
                    onChange={handleChange}
                    required={field.required !== false}
                  />
                )}
              </label>
            ))}
            {error ? <p className="error">{error}</p> : null}
            <button className="primary-button" type="submit">
              <Plus size={18} />
              Create
            </button>
          </form>
        ) : null}

        <div className="table-wrap">
          {editingId ? (
            <form className="inline-edit-form" id={`${resource}-edit-form`} onSubmit={handleEditSubmit}>
              <div>
                <strong>Edit accommodation</strong>
                <span>Update the selected record fields.</span>
              </div>
              <div className="inline-edit-fields">
                {fields.map((field) => (
                  <label key={field.name}>
                    {field.label}
                    {field.type === "file" ? (
                      <>
                        <input
                          accept={field.accept || "image/*"}
                          name={field.name}
                          type="file"
                          onChange={handleEditChange}
                          required={field.required !== false && !editForm[field.name]}
                        />
                        {editForm[field.name] ? <img className="upload-preview" src={editForm[field.name]} alt="Selected upload preview" /> : null}
                      </>
                    ) : (
                      <input
                        name={field.name}
                        type={field.type || "text"}
                        value={editForm[field.name]}
                        min={field.min}
                        onChange={handleEditChange}
                        required={field.required !== false}
                      />
                    )}
                  </label>
                ))}
              </div>
              <div className="inline-edit-actions">
                <button className="secondary-button" type="button" onClick={cancelEditing}>
                  <X size={16} />
                  Cancel
                </button>
                <button className="primary-button" type="submit">
                  <Save size={16} />
                  Save
                </button>
              </div>
            </form>
          ) : null}

          <table>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key}>{column.label}</th>
                ))}
                {canManage ? <th aria-label="Acciones" /> : null}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const isClickable = !canManage && Boolean(getItemHref);
                return (
                <tr
                  className={`${editingId === item.id ? "editing-row" : ""} ${isClickable ? "clickable-row" : ""}`}
                  key={item.id}
                  role={isClickable ? "link" : undefined}
                  tabIndex={isClickable ? 0 : undefined}
                  title={isClickable ? "Book this accommodation" : undefined}
                  onClick={() => goToItem(item)}
                  onKeyDown={(event) => handleItemKeyDown(event, item)}
                >
                  {columns.map((column) => (
                    <td key={column.key}>{column.render ? column.render(item) : item[column.key]}</td>
                  ))}
                  {canManage ? (
                    <td className="actions-cell">
                      <button
                        className="icon-button"
                        type="button"
                        title="Edit"
                        onClick={() => startEditing(item)}
                      >
                        <Pencil size={17} />
                      </button>
                      <button
                        className="icon-button danger"
                        type="button"
                        title="Delete"
                        onClick={() => handleDelete(item)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </td>
                  ) : null}
                </tr>
              );
              })}
            </tbody>
          </table>

          {status === "loading" ? <p className="state-text">Loading...</p> : null}
          {status !== "loading" && items.length === 0 ? <p className="state-text">{emptyText}</p> : null}
        </div>
      </div>
    </section>
  );
}
