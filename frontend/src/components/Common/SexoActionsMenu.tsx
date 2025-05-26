import { IconButton } from "@chakra-ui/react"
import { BsThreeDotsVertical } from "react-icons/bs"
import { MenuContent, MenuRoot, MenuTrigger } from "../ui/menu"

import type { SexoPublic } from "@/client"
import DeleteSexo from "../Sexos/DeleteSexo"
import EditSexo from "../Sexos/EditSexo"

interface SexoActionsMenuProps {
  sexo: SexoPublic
}

export const SexoActionsMenu = ({ sexo }: SexoActionsMenuProps) => {
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <IconButton variant="ghost" color="inherit">
          <BsThreeDotsVertical />
        </IconButton>
      </MenuTrigger>
      <MenuContent>
        <EditSexo sexo={sexo} />
        <DeleteSexo id={sexo.id} />
      </MenuContent>
    </MenuRoot>
  )
}
