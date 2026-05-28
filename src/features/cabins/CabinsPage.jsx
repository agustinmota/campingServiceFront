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
        { key: "identifier", label: "Identificador" },
        { key: "maxCapacity", label: "Capacidad" },
        { key: "pricePerDay", label: "Precio/dia", render: (item) => `$${item.pricePerDay}` }
      ]}
      fields={[
        { name: "identifier", label: "Identificador" },
        { name: "maxCapacity", label: "Capacidad maxima", type: "number", min: 1 },
        { name: "pricePerDay", label: "Precio por dia", type: "number", min: 0 }
      ]}
      canManage={user?.role === "admin"}
    />
  );
}
