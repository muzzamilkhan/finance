"use server";

import Overrides from "../model/overrides";
import { Prisma } from "@prisma/client";

export async function get(id?: number) {
  if (id) {
    return await Overrides().get(id);
  }
  return await Overrides().list();
}

export async function create(data: Prisma.OverridesUncheckedCreateInput) {
    return await Overrides().create(data)
}

export async function update(id: number, data: Prisma.OverridesUncheckedUpdateInput) {
    return await Overrides().update(id, data)
}

export async function remove(id: number) {
    return await Overrides().remove(id);
}

export async function prune() {
    return await Overrides().prune();
}
