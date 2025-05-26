import { IconButton } from "@chakra-ui/react"
import { BsThreeDotsVertical } from "react-icons/bs"
import { MenuContent, MenuRoot, MenuTrigger } from "../ui/menu"

import type { EmpleadoPublic } from "@/client"
import DeleteEmpleado from "../Empleados/DeleteEmpleado"
import EditEmpleado from "../Empleados/EditEmpleado"

interface EmpleadoActionsMenuProps {
  empleado: EmpleadoPublic
}

export const EmpleadoActionsMenu = ({ empleado }: EmpleadoActionsMenuProps) => {
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <IconButton variant="ghost" color="inherit">
          <BsThreeDotsVertical />
        </IconButton>
      </MenuTrigger>
      <MenuContent>
        <EditEmpleado empleado={empleado} />
        <DeleteEmpleado id={empleado.id} />
      </MenuContent>
    </MenuRoot>
  )
}
