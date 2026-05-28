import { useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createResource, deleteResource, fetchResource } from "../features/resources/resourceSlice";

export function ResourcePage({ resource, title, description, columns, fields, emptyText, canManage = true }) {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.resources[resource]);
  const status = useSelector((state) => state.resources.status[resource] || "idle");
  const error = useSelector((state) => state.resources.errors[resource]);
  const initialForm = useMemo(
    () => Object.fromEntries(fields.map((field) => [field.name, field.defaultValue || ""])),
    [fields]
  );
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    dispatch(fetchResource(resource));
  }, [dispatch, resource]);

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    setForm((current) => ({ ...current, [name]: type === "number" ? Number(value) : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(createResource({ resource, values: form }));
    if (createResource.fulfilled.match(result)) {
      setForm(initialForm);
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <button className="icon-button" type="button" title="Actualizar" onClick={() => dispatch(fetchResource(resource))}>
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="work-grid">
        {canManage ? (
          <form className="panel form compact-form" onSubmit={handleSubmit}>
            <h2>Nuevo registro</h2>
            {fields.map((field) => (
              <label key={field.name}>
                {field.label}
                <input
                  name={field.name}
                  type={field.type || "text"}
                  value={form[field.name]}
                  min={field.min}
                  onChange={handleChange}
                  required={field.required !== false}
                />
              </label>
            ))}
            {error ? <p className="error">{error}</p> : null}
            <button className="primary-button" type="submit">
              <Plus size={18} />
              Crear
            </button>
          </form>
        ) : (
          <aside className="panel readonly-panel">
            <h2>Vista de usuario</h2>
            <p>Tu cuenta puede consultar alojamientos disponibles. Las altas, bajas y ediciones quedan para administradores.</p>
          </aside>
        )}

        <div className="table-wrap">
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
              {items.map((item) => (
                <tr key={item.id}>
                  {columns.map((column) => (
                    <td key={column.key}>{column.render ? column.render(item) : item[column.key]}</td>
                  ))}
                  {canManage ? (
                    <td className="actions-cell">
                      <button
                        className="icon-button danger"
                        type="button"
                        title="Eliminar"
                        onClick={() => dispatch(deleteResource({ resource, id: item.id }))}
                      >
                        <Trash2 size={17} />
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>

          {status === "loading" ? <p className="state-text">Cargando...</p> : null}
          {status !== "loading" && items.length === 0 ? <p className="state-text">{emptyText}</p> : null}
        </div>
      </div>
    </section>
  );
}
