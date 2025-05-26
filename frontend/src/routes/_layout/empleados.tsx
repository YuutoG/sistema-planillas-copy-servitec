import {
  Container,
  EmptyState,
  Flex,
  Heading,
  Table,
  VStack,
} from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { FiSearch } from "react-icons/fi"
import { z } from "zod"

import { EmpleadosService } from "@/client"
import { EmpleadoActionsMenu } from "@/components/Common/EmpleadoActionsMenu"
import AddEmpleado from "@/components/Empleados/AddEmpleado"
import PendingItems from "@/components/Pending/PendingItems"
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination.tsx"

const empleadosSearchSchema = z.object({
  page: z.number().catch(1),
})

const PER_PAGE = 5

function getEmpleadosQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      EmpleadosService.readEmpleados({ skip: (page - 1) * PER_PAGE, limit: PER_PAGE }),
    queryKey: ["empleados", { page }],
  }
}

export const Route = createFileRoute("/_layout/empleados")({
  component: Empleados,
  validateSearch: (search) => empleadosSearchSchema.parse(search),
})

function EmpleadosTable() {
  const navigate = useNavigate({ from: Route.fullPath })
  const { page } = Route.useSearch()

  const { data, isLoading, isPlaceholderData } = useQuery({
    ...getEmpleadosQueryOptions({ page }),
    placeholderData: (prevData) => prevData,
  })

  const setPage = (page: number) =>
    navigate({
      search: (prev: { [key: string]: string }) => ({ ...prev, page }),
    })

  const empleados = data?.data.slice(0, PER_PAGE) ?? []
  const count = data?.count ?? 0

  if (isLoading) {
    return <PendingItems />
  }

  if (empleados.length === 0) {
    return (
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Indicator>
            <FiSearch />
          </EmptyState.Indicator>
          <VStack textAlign="center">
            <EmptyState.Title>Aún no tienes empleados</EmptyState.Title>
            <EmptyState.Description>
              Agrega un nuevo empleado para empezar
            </EmptyState.Description>
          </VStack>
        </EmptyState.Content>
      </EmptyState.Root>
    )
  }

  return (
    <>
      <Table.Root size={{ base: "sm", md: "md" }}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader w="sm">Nombre Completo</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">Fecha Nacimiento</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">Fecha de ingreso</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">DUI</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">NIT</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">ISSS</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">NUP</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">Salario</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">Sexo</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {empleados?.map((empleado) => (
            <Table.Row key={empleado.id} opacity={isPlaceholderData ? 0.5 : 1}>
              <Table.Cell truncate maxW="sm">
                {[empleado.primer_nombre, empleado.segundo_nombre, empleado.primer_apellido, empleado.segundo_apellido]
  .filter((val) => val && val.trim() !== "")
  .join(" ")}
              </Table.Cell>
              <Table.Cell truncate maxW="sm">
                {empleado.fecha_nacimiento.toLocaleString("es-ES")}
              </Table.Cell>
              <Table.Cell
                color={!empleado.fecha_ingreso ? "gray" : "inherit"}
                truncate
                maxW="30%"
              >
                {empleado.fecha_ingreso.toLocaleString("es-EN")}
              </Table.Cell>
              <Table.Cell truncate maxW="sm">
                {empleado.numero_documento}
              </Table.Cell>
              <Table.Cell truncate maxW="sm">
                {empleado.numero_nit}
              </Table.Cell>
              <Table.Cell truncate maxW="sm">
                {empleado.codigo_isss}
              </Table.Cell>
              <Table.Cell truncate maxW="sm">
                {empleado.codigo_nup}
              </Table.Cell>
              <Table.Cell truncate maxW="sm">
                {empleado.salario}
              </Table.Cell>
              <Table.Cell truncate maxW="sm">
                {empleado.nombre_sexo}
              </Table.Cell>
              <Table.Cell>
                <EmpleadoActionsMenu empleado={empleado} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Flex justifyContent="flex-end" mt={4}>
        <PaginationRoot
          count={count}
          pageSize={PER_PAGE}
          onPageChange={({ page }) => setPage(page)}
        >
          <Flex>
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </Flex>
        </PaginationRoot>
      </Flex>
    </>
  )
}

function Empleados() {
  return (
    <Container maxW="full">
      <Heading size="lg" pt={12}>
        Administración de Empleados
      </Heading>
      <AddEmpleado />
      <EmpleadosTable />
    </Container>
  )
}
