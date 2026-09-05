import { useState } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import '../i18n'
import RetroBoard from './RetroBoard'
import type { RetroNotes } from '../types'

// RetroBoard is fully controlled (calls onChange, doesn't hold its own note
// state), so a thin stateful wrapper is needed to see interactions reflected
// in the DOM across renders — matching how App.tsx actually uses it.
function ControlledRetroBoard({ onChangeSpy }: { onChangeSpy?: (n: RetroNotes) => void }) {
  const [notes, setNotes] = useState<RetroNotes>({})
  return (
    <RetroBoard
      notes={notes}
      format="classic"
      onChange={n => {
        setNotes(n)
        onChangeSpy?.(n)
      }}
    />
  )
}

function addNote(text: string) {
  const input = screen.getAllByPlaceholderText('Add a note...')[0]
  fireEvent.change(input, { target: { value: text } })
  fireEvent.keyDown(input, { key: 'Enter' })
}

describe('RetroBoard note CRUD', () => {
  it('adds a note to the first column', () => {
    const onChangeSpy = vi.fn()
    render(<ControlledRetroBoard onChangeSpy={onChangeSpy} />)

    addNote('Deploys went smoothly')

    expect(screen.getByText('Deploys went smoothly')).toBeInTheDocument()
    expect(onChangeSpy).toHaveBeenCalledWith(
      expect.objectContaining({ wellDone: [expect.objectContaining({ text: 'Deploys went smoothly' })] }),
    )
  })

  it('trims whitespace and ignores empty submissions', () => {
    render(<ControlledRetroBoard />)
    addNote('   ')
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)

    addNote('  Spaced text  ')
    expect(screen.getByText('Spaced text')).toBeInTheDocument()
  })

  it('edits an existing note', () => {
    render(<ControlledRetroBoard />)
    addNote('Original text')

    fireEvent.click(screen.getByLabelText('Original text — click to edit'))
    const textarea = screen.getByPlaceholderText('Edit note...')
    fireEvent.change(textarea, { target: { value: 'Updated text' } })
    fireEvent.keyDown(textarea, { key: 'Enter' })

    expect(screen.queryByText('Original text')).not.toBeInTheDocument()
    expect(screen.getByText('Updated text')).toBeInTheDocument()
  })

  it('deletes a note only after the second (confirm) click', () => {
    render(<ControlledRetroBoard />)
    addNote('Note to delete')
    expect(screen.getByText('Note to delete')).toBeInTheDocument()

    const deleteBtn = screen.getByLabelText('Delete note')
    fireEvent.click(deleteBtn)
    expect(screen.getByText('Note to delete')).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Delete this note?'))
    expect(screen.queryByText('Note to delete')).not.toBeInTheDocument()
  })

  it('votes a note up and down, never below zero', () => {
    render(<ControlledRetroBoard />)
    addNote('Vote target')

    const upvote = screen.getByLabelText('Vote')
    fireEvent.click(upvote)
    fireEvent.click(upvote)
    expect(within(upvote).getByText('2')).toBeInTheDocument()

    const downvote = screen.getByLabelText('Remove vote')
    fireEvent.click(downvote)
    fireEvent.click(downvote)
    fireEvent.click(downvote)
    // votes clamp at 0 rather than going negative — the count badge and the
    // downvote button both disappear entirely once votes hits 0 (StickyNote
    // only renders them when votes > 0)
    expect(within(upvote).queryByText(/\d/)).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Remove vote')).not.toBeInTheDocument()
  })

  it('keeps notes in other columns untouched when editing one column', () => {
    render(<ControlledRetroBoard />)
    const inputs = screen.getAllByPlaceholderText('Add a note...')
    fireEvent.change(inputs[0], { target: { value: 'Well done note' } })
    fireEvent.keyDown(inputs[0], { key: 'Enter' })
    fireEvent.change(inputs[1], { target: { value: 'To improve note' } })
    fireEvent.keyDown(inputs[1], { key: 'Enter' })

    fireEvent.click(screen.getByLabelText('Well done note — click to edit'))
    const textarea = screen.getByPlaceholderText('Edit note...')
    fireEvent.change(textarea, { target: { value: 'Well done note (edited)' } })
    fireEvent.keyDown(textarea, { key: 'Enter' })

    expect(screen.getByText('Well done note (edited)')).toBeInTheDocument()
    expect(screen.getByText('To improve note')).toBeInTheDocument()
  })
})
