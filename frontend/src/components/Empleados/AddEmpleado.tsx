import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { type SubmitHandler, useForm } from "react-hook-form"

import {
  Button,
  DialogActionTrigger,
  DialogTitle,
  Input,
  NumberInput,
  NativeSelect,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useState } from "react"
import { FaPlus } from "react-icons/fa"

import { type EmpleadoCreate, EmpleadosService, SexosService } from "@/client"
import type { ApiError } from "@/client/core/ApiError"
import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from "../ui/dialog"
import { Field } from "../ui/field"

// Para listar la información de Sexo
function getSexosQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      SexosService.readSexos({ skip: (page - 1) * 10, limit: 100 }),
    queryKey: ["sexos", { page }],
  }
}

const AddEmpleado = () => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { showSuccessToast } = useCustomToast()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<EmpleadoCreate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      primer_nombre: "",
      segundo_nombre: "",
      primer_apellido: "",
      segundo_apellido: "",
      apellido_casada: "",
      fecha_nacimiento: undefined,
      fecha_ingreso: undefined,
      numero_documento: "",
      numero_nit: "",
      codigo_isss: "",
      codigo_nup: "",
      salario: 0,
      id_sexo: ""
    },
  })

  // Para listar la información de Sexo
  const { data: data_sexo, isLoading: isLoading_sexo, isPlaceholderData: isPlaceholderData_sexo } = useQuery({
    ...getSexosQueryOptions({ page: 1 }),
    placeholderData: (prevData) => prevData,
  })
  const sexos = data_sexo?.data.slice(0, 100) ?? []
  // const count = data?.count ?? 0

  const mutation = useMutation({
    mutationFn: (data: EmpleadoCreate) =>
      EmpleadosService.createEmpleado({ requestBody: data }),
    onSuccess: () => {
      showSuccessToast("Empleado creado exitosamente.")
      reset()
      setIsOpen(false)
    },
    onError: (err: ApiError) => {
      handleError(err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["empleados"] })
    },
  })

  const onSubmit: SubmitHandler<EmpleadoCreate> = (data) => {
    console.log(data)
    mutation.mutate(data)
  }
  const opciones_sexo = (sexos.map((sexo) => (
    <option key={sexo.id} value={sexo.id}>{sexo.nombre_sexo}</option>)));

  return (
    <DialogRoot
      size={{ base: "xs", md: "md" }}
      placement="center"
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open)}
    >
      <DialogTrigger asChild>
        <Button value="add-empleado" my={4}>
          <FaPlus fontSize="16px" />
          Agregar Empleado
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Agregar Empleado</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Text mb={4}>Agrega la información del nuevo empleado.</Text>
            <VStack gap={4}>
              <Field
                required
                invalid={!!errors.primer_nombre}
                errorText={errors.primer_nombre?.message}
                label="Primer nombre"
              >
                <Input
                  id="primer_nombre"
                  {...register("primer_nombre", {
                    required: "El primer nombre es obligatorio.",
                  })}
                  placeholder="El primer nombre"
                  type="text"
                />
              </Field>

              <Field
                invalid={!!errors.segundo_nombre}
                errorText={errors.segundo_nombre?.message}
                label="Segundo nombre"
              >
                <Input
                  id="segundo_nombre"
                  {...register("segundo_nombre")}
                  placeholder="Segundo nombre..."
                  type="text"
                />
              </Field>
              <Field
                required
                invalid={!!errors.primer_apellido}
                errorText={errors.primer_apellido?.message}
                label="Primer apellido"
              >
                <Input
                  id="primer_apellido"
                  {...register("primer_apellido", {
                    required: "El primer apellido es obligatorio.",
                  })}
                  placeholder="El primer apellido"
                  type="text"
                />
              </Field>
              <Field
                invalid={!!errors.segundo_apellido}
                errorText={errors.segundo_apellido?.message}
                label="Segundo apellido"
              >
                <Input
                  id="segundo_apellido"
                  {...register("segundo_apellido")}
                  placeholder="Segundo apellido..."
                  type="text"
                />
              </Field>
              <Field
                invalid={!!errors.apellido_casada}
                errorText={errors.apellido_casada?.message}
                label="Apellido de casada"
              >
                <Input
                  id="apellido_casada"
                  {...register("apellido_casada")}
                  placeholder="Apellido de casada..."
                  type="text"
                />
              </Field>
              <Field
                invalid={!!errors.fecha_nacimiento}
                errorText={errors.fecha_nacimiento?.message}
                label="Fecha de Nacimiento"
              >
                <Input
                  id="fecha_nacimiento"
                  {...register("fecha_nacimiento", { required: "La fecha de nacimiento es obligatoria.", })}
                  placeholder="Fecha de nacimiento..."
                  min={"1932-01-01"}
                  max={"2025-05-26"}
                  type="date"
                />
              </Field>
              <Field
                invalid={!!errors.fecha_ingreso}
                errorText={errors.fecha_ingreso?.message}
                label="Fecha de ingreso"
              >
                <Input
                  id="fecha_ingreso"
                  {...register("fecha_ingreso", { required: "La fecha de ingreso es obligatoria.", })}
                  placeholder="Fecha de ingreso..."
                  type="date"
                />
              </Field>
              <Field
                invalid={!!errors.numero_documento}
                errorText={errors.numero_documento?.message}
                label="DUI"
              >
                <Input
                  id="numero_documento"
                  {...register("numero_documento", { required: "El DUI es obligatorio.", })}
                  placeholder="Documento Único de Identidad..."
                  type="text"
                />
              </Field>
              <Field
                invalid={!!errors.numero_nit}
                errorText={errors.numero_nit?.message}
                label="NIT"
              >
                <Input
                  id="numero_nit"
                  {...register("numero_nit", { required: "El NIT es obligatorio.", })}
                  placeholder="Número de Identificación Tributaria..."
                  type="text"
                />
              </Field>
              <Field
                invalid={!!errors.codigo_isss}
                errorText={errors.codigo_isss?.message}
                label="ISSS"
              >
                <Input
                  id="codigo_isss"
                  {...register("codigo_isss", { required: "El código ISSS es obligatorio.", })}
                  placeholder="Número de Identificación del ISSS..."
                  type="text"
                />
              </Field>
              <Field
                invalid={!!errors.codigo_nup}
                errorText={errors.codigo_nup?.message}
                label="NUP"
              >
                <Input
                  id="codigo_nup"
                  {...register("codigo_nup", { required: "El NUP es obligatorio.", })}
                  placeholder="Número para las pensiones..."
                  type="text"
                />
              </Field>
              <Field
                invalid={!!errors.salario}
                errorText={errors.salario?.message}
                label="Salario"
              >
                <NumberInput.Root
                  formatOptions={{
                    style: "decimal",
                    maximumFractionDigits: 2,
                    useGrouping: false,
                  }}
                  step={0.01}
                >
                  <NumberInput.Control />
                  <NumberInput.Input {...register("salario", { required: "El Salario es obligatorio.", valueAsNumber: true })} />
                </NumberInput.Root>
              </Field>
              <Field
                invalid={!!errors.id_sexo}
                errorText={errors.id_sexo?.message}
                label="Sexo"
              >
                <NativeSelect.Root>
                  <NativeSelect.Field {...register("id_sexo", { required: "El sexo es obligatorio.", })}>
                    {opciones_sexo}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Field>
            </VStack>
          </DialogBody>

          <DialogFooter gap={2}>
            <DialogActionTrigger asChild>
              <Button
                variant="subtle"
                colorPalette="gray"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            </DialogActionTrigger>
            <Button
              variant="solid"
              type="submit"
              disabled={!isValid}
              loading={isSubmitting}
            >
              Guardar
            </Button>
          </DialogFooter>
        </form>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}

export default AddEmpleado
