import { ResourcePage } from "../../shared/ResourcePage";

export function GuestsPage() {
  return (
    <ResourcePage
      resource="guests"
      title="Huespedes"
      description="Registro de personas asociadas a reservas."
      emptyText="No hay huespedes cargados."
      columns={[
        { key: "firstName", label: "Nombre" },
        { key: "lastName", label: "Apellido" },
        { key: "document", label: "Documento" },
        { key: "phone", label: "Telefono" }
      ]}
      fields={[
        { name: "firstName", label: "Nombre" },
        { name: "lastName", label: "Apellido" },
        { name: "document", label: "Documento" },
        { name: "phone", label: "Telefono" }
      ]}
    />
  );
}
