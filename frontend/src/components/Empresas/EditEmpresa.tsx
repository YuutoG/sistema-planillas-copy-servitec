import {
  Button,
  ButtonGroup,
  DialogActionTrigger,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { FaExchangeAlt } from "react-icons/fa"

import { type ApiError, type EmpresaPublic, EmpresasService } from "@/client"
import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Field } from "../ui/field"

interface EditEmpresaProps {
  empresa: EmpresaPublic
}

interface EmpresaUpdateForm {
  nombre_empresa: string
  direccion: string
  representante_legal: string
  nit: string
  nic: string
  telefono: string
  pagina_web: string
  correo_electronico: string
}

const EditEmpresa = ({ empresa }: EditEmpresaProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { showSuccessToast } = useCustomToast()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmpresaUpdateForm>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      ...empresa,
      // description: item.description ?? undefined,
    },
  })

  const mutation = useMutation({
    mutationFn: (data: EmpresaUpdateForm) =>
      EmpresasService.updateEmpresa({ id: empresa.id, requestBody: data }),
    onSuccess: () => {
      showSuccessToast("Item updated successfully.")
      reset()
      setIsOpen(false)
    },
    onError: (err: ApiError) => {
      handleError(err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["empresas"] })
    },
  })

  const onSubmit: SubmitHandler<EmpresaUpdateForm> = async (data) => {
    mutation.mutate(data)
  }

  return (
    <DialogRoot
      size={{ base: "xs", md: "md" }}
      placement="center"
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open)}
    >
      <DialogTrigger asChild>
        <Button variant="ghost">
          <FaExchangeAlt fontSize="16px" />
          Editar Empresa
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Editar Empresa</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Text mb={4}>Actualizar los detalles de la empresa a continuación.</Text>
            <VStack gap={4}>
              <Field
                required
                invalid={!!errors.nombre_empresa}
                errorText={errors.nombre_empresa?.message}
                label="Nombre"
              >
                <Input
                  id="nombre"
                  {...register("nombre_empresa", {
                    required: "El nombre es obligatorio.",
                  })}
                  placeholder="Nombre de la empresa"
                  type="text"
                />
              </Field>
              <Field
                invalid={!!errors.direccion}
                errorText={errors.direccion?.message}
                label="Dirección"
              >
                <Input
                  id="direccion"
                  {...register("direccion")}
                  placeholder="Dirección de la empresa"
                  type="text"
                />
              </Field>
              <Field
                invalid={!!errors.representante_legal}
                errorText={errors.representante_legal?.message}
                label="Representante Legal"
              >
                <Input
                  id="representante_legal"
                  {...register("representante_legal")}
                  placeholder="Nombre del representante legal de la empresa."
                  type="text"
                />
              </Field>
              <Field
                invalid={!!errors.nit}
                errorText={errors.nit?.message}
                label="NIT"
              >
                <Input
                  id="nit"
                  {...register("nit")}
                  placeholder="Número de Identificación Tributaria de la empresa"
                  type="text"
                />
              </Field>
              <Field
                invalid={!!errors.nic}
                errorText={errors.nic?.message}
                label="NIC"
              >
                <Input
                  id="nic"
                  {...register("nic")}
                  placeholder="NIC de la empresa"
                  type="text"
                />
              </Field>
              <Field
                invalid={!!errors.telefono}
                errorText={errors.telefono?.message}
                label="Teléfono"
              >
                <Input
                  id="telefono"
                  {...register("telefono")}
                  placeholder="Número de teléfono de la empresa"
                  type="text"
                />
              </Field>
              <Field
                invalid={!!errors.pagina_web}
                errorText={errors.pagina_web?.message}
                label="Página Web"
              >
                <Input
                  id="pagina_web"
                  {...register("pagina_web")}
                  placeholder="Página web de la empresa"
                  type="text"
                />
              </Field>
              <Field
                invalid={!!errors.correo_electronico}
                errorText={errors.correo_electronico?.message}
                label="La dirección de correo eléctronico"
              >
                <Input
                  id="correo_electronico"
                  {...register("correo_electronico")}
                  placeholder="La dirección de correo eléctronico de la empresa"
                  type="text"
                />
              </Field>
            </VStack>
          </DialogBody>

          <DialogFooter gap={2}>
            <ButtonGroup>
              <DialogActionTrigger asChild>
                <Button
                  variant="subtle"
                  colorPalette="gray"
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
              </DialogActionTrigger>
              <Button variant="solid" type="submit" loading={isSubmitting}>
                Guardar
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </form>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}

export default EditEmpresa
