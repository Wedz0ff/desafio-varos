"use client"

import React, { useState, useEffect } from "react"
import { updateUser, getConsultants } from "@/src/app/(dashboard)/actions"
import { CreateUserInput, UpdateUserInput, UserType } from "@/src/types/user"
import { toast } from "sonner"
import { formatCPF, formatPhone, formatCEP, unformatCEP } from "@/src/lib/formatters"
import { useCep } from "@/src/hooks/use-cep"
import { Button } from "@/src/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"

type UserData = {
  id: string
  name: string
  email: string
  phone: string
  cpf: string
  cep: string
  address: string
  complement: string | null
  age: number | null
  type: UserType
  consultantId: string | null
}

type EditUserModalProps = {
  user: UserData
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditUserModal({ user, open, onOpenChange }: EditUserModalProps) {
  const [loading, setLoading] = useState(false)
  const [consultants, setConsultants] = useState<Array<{ id: string; name: string; email: string }>>([])
  const { loading: cepLoading, fetchAddress } = useCep()
  const [formData, setFormData] = useState<Omit<CreateUserInput, "consultantId" | "age"> & { id: string; consultantId: string | null; age: number | null }>({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: formatPhone(user.phone),
    cpf: formatCPF(user.cpf),
    cep: formatCEP(user.cep),
    address: user.address,
    complement: user.complement || "",
    type: user.type,
    age: user.age,
    consultantId: user.consultantId,
  })

  // Load consultants when dialog opens
  useEffect(() => {
    if (open) {
      getConsultants().then((data) => {
        setConsultants(data)
      }).catch((error) => {
        console.error("Error loading consultants:", error)
      })
    }
  }, [open])

  // Reset form data when user prop changes
  useEffect(() => {
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: formatPhone(user.phone),
      cpf: formatCPF(user.cpf),
      cep: formatCEP(user.cep),
      address: user.address,
      complement: user.complement || "",
      type: user.type,
      age: user.age,
      consultantId: user.consultantId,
    })
  }, [user])

  // Fetch address when CEP is complete
  useEffect(() => {
    const unformattedCep = unformatCEP(formData.cep)
    if (unformattedCep.length === 8) {
      fetchAddress(unformattedCep)
        .then((data) => {
          if (data) {
            setFormData((prev) => ({
              ...prev,
              address: data.logradouro || prev.address,
              complement: data.complemento || prev.complement,
            }))
          }
        })
        .catch((error) => {
          console.error("CEP lookup error:", error)
        })
    }
  }, [formData.cep, fetchAddress])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const dataToSubmit: UpdateUserInput = {
        id: formData.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone.replace(/\D/g, ""),
        cpf: formData.cpf.replace(/\D/g, ""),
        cep: unformatCEP(formData.cep),
        address: formData.address,
        complement: formData.complement,
        type: formData.type,
        age: formData.age ?? undefined,
        consultantId: formData.consultantId ?? undefined,
      }

      const result = await updateUser(dataToSubmit)

      if (result.success) {
        toast.success("Usuário atualizado com sucesso!")
        onOpenChange(false)
      } else {
        toast.error(result.error || "Erro ao atualizar usuário")
      }
    } catch (error) {
      toast.error("Erro ao atualizar usuário")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Atualize os dados do usuário abaixo. Todos os campos marcados com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-name">Nome *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-email">Email *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-phone">Telefone *</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const formatted = formatPhone(e.target.value)
                    setFormData({ ...formData, phone: formatted })
                  }}
                  placeholder="(11) 98765-4321"
                  required
                  maxLength={15}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-cpf">CPF *</Label>
                <Input
                  id="edit-cpf"
                  value={formData.cpf}
                  onChange={(e) => {
                    const formatted = formatCPF(e.target.value)
                    setFormData({ ...formData, cpf: formatted })
                  }}
                  placeholder="123.456.789-01"
                  required
                  maxLength={14}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-age">Idade</Label>
                <Input
                  id="edit-age"
                  type="number"
                  value={formData.age || ""}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value ? Number(e.target.value) : null })}
                  min="0"
                  max="150"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-cep">CEP *</Label>
                <Input
                  id="edit-cep"
                  value={formData.cep}
                  onChange={(e) => {
                    const formatted = formatCEP(e.target.value)
                    setFormData({ ...formData, cep: formatted })
                  }}
                  placeholder="01310-100"
                  required
                  maxLength={9}
                  disabled={cepLoading}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-address">Endereço *</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Av. Paulista, 1578"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-complement">Complemento</Label>
              <Input
                id="edit-complement"
                value={formData.complement}
                onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                placeholder="Conjunto 405"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-type">Tipo *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as UserType })}
                >
                  <SelectTrigger id="edit-type">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserType.CLIENT}>Cliente</SelectItem>
                    <SelectItem value={UserType.CONSULTANT}>Consultor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.type === UserType.CLIENT && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="edit-consultant">Consultor</Label>
                  <Select
                    value={formData.consultantId || "none"}
                    onValueChange={(value) => setFormData({ ...formData, consultantId: value === "none" ? null : value })}
                  >
                    <SelectTrigger id="edit-consultant">
                      <SelectValue placeholder="Selecione um consultor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum</SelectItem>
                      {consultants.map((consultant) => (
                        <SelectItem key={consultant.id} value={consultant.id}>
                          {consultant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Atualizando..." : "Atualizar Usuário"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
