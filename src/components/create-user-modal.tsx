"use client"

import React, { useState, useEffect } from "react"
import { createUser, getConsultants } from "@/src/app/(dashboard)/actions"
import { CreateUserInput, UserType } from "@/src/types/user"
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
  DialogTrigger,
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
import { IconPlus } from "@tabler/icons-react"

export function CreateUserModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [consultants, setConsultants] = useState<Array<{ id: string; name: string; email: string }>>([])
  const { loading: cepLoading, fetchAddress } = useCep()
  const [formData, setFormData] = useState<CreateUserInput>({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    cep: "",
    address: "",
    complement: "",
    type: UserType.CLIENT,
    age: undefined,
    consultantId: undefined,
  })

  React.useEffect(() => {
    if (open) {
      getConsultants().then((data) => {
        setConsultants(data)
      }).catch((error) => {
        console.error("Error loading consultants:", error)
      })
    }
  }, [open])

  useEffect(() => {
    const unformattedCep = unformatCEP(formData.cep)
    if (unformattedCep.length === 8) {
      fetchAddress(unformattedCep)
        .then((data) => {
          if (data) {
            setFormData((prev) => ({
              ...prev,
              address: data.logradouro || "",
              complement: data.complemento || prev.complement,
            }))
          }
        })
        .catch((error) => {
          toast.error("Erro ao buscar endereço pelo CEP")
          console.error("CEP lookup error:", error)
        })
    }
  }, [formData.cep, fetchAddress])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const dataToSubmit = {
        ...formData,
        cpf: formData.cpf.replace(/\D/g, ""),
        phone: formData.phone.replace(/\D/g, ""),
        cep: unformatCEP(formData.cep),
        age: formData.age ? Number(formData.age) : undefined,
      }

      const result = await createUser(dataToSubmit)

      if (result.success) {
        toast.success("Usuário criado com sucesso!")
        setOpen(false)
        setFormData({
          name: "",
          email: "",
          phone: "",
          cpf: "",
          cep: "",
          address: "",
          complement: "",
          type: UserType.CLIENT,
          age: undefined,
          consultantId: undefined,
        })
      } else {
        toast.error(result.error || "Erro ao criar usuário")
      }
    } catch (error) {
      toast.error("Erro ao criar usuário")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          <IconPlus />
          <span className="hidden lg:inline">Adicionar Usuário</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Usuário</DialogTitle>
          <DialogDescription>
            Preencha os dados do usuário abaixo. Todos os campos marcados com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
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
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
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
                <Label htmlFor="age">Idade</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age || ""}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value ? Number(e.target.value) : undefined })}
                  min="0"
                  max="150"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="cep">CEP *</Label>
                <Input
                  id="cep"
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
              <Label htmlFor="address">Endereço *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Av. Paulista, 1578"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                value={formData.complement}
                onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                placeholder="Conjunto 405"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="type">Tipo *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as UserType })}
                >
                  <SelectTrigger id="type">
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
                  <Label htmlFor="consultant">Consultor</Label>
                  <Select
                    value={formData.consultantId || "none"}
                    onValueChange={(value) => setFormData({ ...formData, consultantId: value === "none" ? undefined : value })}
                  >
                    <SelectTrigger id="consultant">
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar Usuário"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
