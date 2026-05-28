import { ResourcePage } from "../../shared/ResourcePage";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../auth/authSlice";

export function CabinsPage() {
  const user = useSelector(selectAuthUser);

  return (
    <ResourcePage
      resource="cabins"
      title="Cabanas"
      description="Administracion de alojamientos con precio por dia."
      emptyText="No hay cabanas cargadas."
      columns={[
        {
          key: "imageUrl",
          label: "Foto",
          render: (item) => (
            <img className="resource-thumb" src={item.imageUrl} alt={`Cabana ${item.identifier}`} />
          )
        },
        { key: "identifier", label: "Identificador" },
        { key: "description", label: "Descripcion" },
        { key: "maxCapacity", label: "Capacidad" },
        { key: "pricePerDay", label: "Precio/dia", render: (item) => `$${item.pricePerDay}` }
      ]}
      fields={[
        { name: "identifier", label: "Identificador" },
        { name: "description", label: "Descripcion" },
        { name: "maxCapacity", label: "Capacidad maxima", type: "number", min: 1 },
        { name: "pricePerDay", label: "Precio por dia", type: "number", min: 0 },
        { name: "imageUrl", label: "URL de foto" }
      ]}
      canManage={user?.role === "admin"}
    />
  );
}
