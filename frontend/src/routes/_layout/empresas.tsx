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

import { EmpresasService } from "@/client"
import { EmpresaActionsMenu } from "../../components/Common/EmpresaActionsMenu"
import AddEmpresa from "@/components/Empresas/AddEmpresa"
import PendingItems from "@/components/Pending/PendingItems"
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination.tsx"

const empresasSearchSchema = z.object({
  page: z.number().catch(1),
})

const PER_PAGE = 5

function getEmpresasQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      EmpresasService.readEmpresas({ skip: (page - 1) * PER_PAGE, limit: PER_PAGE }),
    queryKey: ["empresas", { page }],
  }
}

export const Route = createFileRoute("/_layout/empresas")({
  component: Empresas,
  validateSearch: (search) => empresasSearchSchema.parse(search),
})

function EmpresasTable() {
  const navigate = useNavigate({ from: Route.fullPath })
  const { page } = Route.useSearch()

  const { data, isLoading, isPlaceholderData } = useQuery({
    ...getEmpresasQueryOptions({ page }),
    placeholderData: (prevData) => prevData,
  })

  const setPage = (page: number) =>
    navigate({
      search: (prev: { [key: string]: string }) => ({ ...prev, page }),
    })

  const empresas = data?.data.slice(0, PER_PAGE) ?? []
  const count = data?.count ?? 0

  if (isLoading) {
    return <PendingItems />
  }

  if (empresas.length === 0) {
    return (
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Indicator>
            <FiSearch />
          </EmptyState.Indicator>
          <VStack textAlign="center">
            <EmptyState.Title>Aún no has creado una empresa.</EmptyState.Title>
            <EmptyState.Description>
              Agrega una nueva empresa para empezar
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
            <Table.ColumnHeader w="sm">ID</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">Nombre</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">Dirección</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">Representante</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">NIT</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">NIC</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">Teléfono</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">Website</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">Email</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">Creación</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">Acciones</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {empresas?.map((empresa) => (
            <Table.Row key={empresa.id} opacity={isPlaceholderData ? 0.5 : 1}>
              <Table.Cell truncate maxW="sm">
                {empresa.id}
              </Table.Cell>
              <Table.Cell truncate maxW="sm">
                {empresa.nombre_empresa}
              </Table.Cell>
              <Table.Cell truncate maxW="sm">
                {empresa.direccion}
              </Table.Cell>
              <Table.Cell truncate maxW="sm">
                {empresa.representante_legal}
              </Table.Cell>
              <Table.Cell truncate maxW="sm">
                {empresa.nit}
              </Table.Cell>
              <Table.Cell truncate maxW="sm">
                {empresa.nic}
              </Table.Cell>
              <Table.Cell truncate maxW="sm">
                {empresa.telefono}
              </Table.Cell>
              <Table.Cell truncate maxW="sm">
                {empresa.pagina_web}
              </Table.Cell>
              <Table.Cell truncate maxW="sm">
                {empresa.correo_electronico}
              </Table.Cell>
              <Table.Cell truncate maxW="sm">
                {empresa.created_at.toLocaleString("es-ES")}
              </Table.Cell>
              <Table.Cell>
                <EmpresaActionsMenu empresa={empresa} />
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

function Empresas() {
  return (
    <Container maxW="full">
      <Heading size="lg" pt={12}>
        Administración de Empresa
      </Heading>
      <AddEmpresa />
      <EmpresasTable />
    </Container>
  )
}
