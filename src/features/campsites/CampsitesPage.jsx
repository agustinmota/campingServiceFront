import { ResourcePage } from "../../shared/ResourcePage";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../auth/authSlice";

export function CampsitesPage() {
  const user = useSelector(selectAuthUser);

  return (
    <ResourcePage
      resource="campsites"
      title="Parcelas"
      description="Espacios de camping con tarifa por persona."
      emptyText="No hay parcelas cargadas."
      columns={[
        {
          key: "imageUrl",
          label: "Foto",
          render: (item) => (
            <img className="resource-thumb" src={item.imageUrl} alt={`Parcela ${item.identifier}`} />
          )
        },
        { key: "identifier", label: "Identificador" },
        { key: "description", label: "Descripcion" },
        { key: "maxCapacity", label: "Capacidad" },
        { key: "pricePerPerson", label: "Precio/persona", render: (item) => `$${item.pricePerPerson}` }
      ]}
      fields={[
        { name: "identifier", label: "Identificador" },
        { name: "description", label: "Descripcion" },
        { name: "maxCapacity", label: "Capacidad maxima", type: "number", min: 1 },
        { name: "pricePerPerson", label: "Precio por persona", type: "number", min: 0 },
        { name: "imageUrl", label: "URL de foto" }
      ]}
      canManage={user?.role === "admin"}
    />
  );
}
