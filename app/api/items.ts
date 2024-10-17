'use server';

import Particulars from '../model/particulars';
import { Prisma } from '@prisma/client';

export async function get(id?: number) {
    if (id) {
        return await Particulars().get(id);
    }
    return await Particulars().list();
}

export async function create(data: Prisma.ParticularsUncheckedCreateInput) {
    return await Particulars().create(data)
}
export async function update(id: number, data: Prisma.ParticularsUncheckedUpdateInput) {
    return await Particulars().update(id, data)
}
export async function remove(id: number) {
    return await Particulars().remove(id)
}
