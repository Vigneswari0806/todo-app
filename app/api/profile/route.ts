export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { name, currentPassword, newPassword } = await req.json()

    const user = await db.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    if (currentPassword) {
      const passwordMatch = await bcrypt.compare(currentPassword, user.password)
      if (!passwordMatch) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
      }
    }

    const updateData: any = {}
    if (name) updateData.name = name
    if (newPassword) updateData.password = await bcrypt.hash(newPassword, 10)

    await db.user.update({
      where: { id: session.user.id },
      data: updateData,
    })

    return NextResponse.json({ message: 'Profile updated successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}