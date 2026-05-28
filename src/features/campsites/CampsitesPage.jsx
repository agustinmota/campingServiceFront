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
        { key: "identifier", label: "Identificador" },
        { key: "maxCapacity", label: "Capacidad" },
        { key: "pricePerPerson", label: "Precio/persona", render: (item) => `$${item.pricePerPerson}` }
      ]}
      fields={[
        { name: "identifier", label: "Identificador" },
        { name: "maxCapacity", label: "Capacidad maxima", type: "number", min: 1 },
        { name: "pricePerPerson", label: "Precio por persona", type: "number", min: 0 }
      ]}
      canManage={user?.role === "admin"}
    />
  );
}
