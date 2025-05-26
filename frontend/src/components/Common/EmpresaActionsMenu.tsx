import { IconButton } from "@chakra-ui/react"
import { BsThreeDotsVertical } from "react-icons/bs"
import { MenuContent, MenuRoot, MenuTrigger } from "../ui/menu"

import type { EmpresaPublic } from "@/client"
import DeleteEmpresa from "../Empresas/DeleteEmpresa"
import EditEmpresa from "../Empresas/EditEmpresa"

interface EmpresaActionsMenuProps {
  empresa: EmpresaPublic
}

export const EmpresaActionsMenu = ({ empresa }: EmpresaActionsMenuProps) => {
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <IconButton variant="ghost" color="inherit">
          <BsThreeDotsVertical />
        </IconButton>
      </MenuTrigger>
      <MenuContent>
        <EditEmpresa empresa={empresa} />
        <DeleteEmpresa id={empresa.id} />
      </MenuContent>
    </MenuRoot>
  )
}
