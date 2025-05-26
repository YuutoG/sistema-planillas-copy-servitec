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

import { type ApiError, type SexoPublic, SexosService } from "@/client"
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

interface EditSexoProps {
  sexo: SexoPublic
}

interface SexoUpdateForm {
  nombre_sexo: string
}

const EditSexo = ({ sexo }: EditSexoProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { showSuccessToast } = useCustomToast()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SexoUpdateForm>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      ...sexo,
      // description: item.description ?? undefined,
    },
  })

  const mutation = useMutation({
    mutationFn: (data: SexoUpdateForm) =>
      SexosService.updateSexo({ id: sexo.id, requestBody: data }),
    onSuccess: () => {
      showSuccessToast("Sexo Actualizado con éxito.")
      reset()
      setIsOpen(false)
    },
    onError: (err: ApiError) => {
      handleError(err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sexos"] })
    },
  })

  const onSubmit: SubmitHandler<SexoUpdateForm> = async (data) => {
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
          Editar Sexo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Editar Sexo</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Text mb={4}>Actualiza la información del Sexo a continuación.</Text>
            <VStack gap={4}>
              <Field
                required
                invalid={!!errors.nombre_sexo}
                errorText={errors.nombre_sexo?.message}
                label="Nombre"
              >
                <Input
                  id="nombre"
                  {...register("nombre_sexo", {
                    required: "El nombre es obligatorio.",
                  })}
                  placeholder="Nombre del sexo..."
                  type="text"
                />
              </Field>

              {/* <Field
                invalid={!!errors.description}
                errorText={errors.description?.message}
                label="Description"
              >
                <Input
                  id="description"
                  {...register("description")}
                  placeholder="Description"
                  type="text"
                />
              </Field> */}
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

export default EditSexo
