import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const data = await req.json()

    const todo = await db.todo.update({
      where: { id, userId: session.user.id },
      data,
    })

    return NextResponse.json(todo)
  } catch (error) {
    console.error('PATCH error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    await db.todo.delete({
      where: { id, userId: session.user.id },
    })

    return NextResponse.json({ message: 'Todo deleted' })
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}