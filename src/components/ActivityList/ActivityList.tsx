import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import {
  DeleteOutlined as DeleteOutlineIcon,
  EditOutlined as EditOutlinedIcon,
} from '@mui/icons-material'
import type {
  TTransaction,
  TPrize,
  TActivityItem,
  TNewTransaction,
  TNewPrize,
} from '../../types/bonds'
import { MONTHS, toYearMonth, fromYearMonth, formatYearMonth } from '../../utils/date'

type TEditFormValues = {
  month: string
  year: string
  amount: number
  type: 'deposit' | 'withdrawal'
}

interface IActivityListProps {
  transactions: TTransaction[]
  prizes: TPrize[]
  onUpdateTransaction: (id: string, data: TNewTransaction) => Promise<void>
  onDeleteTransaction: (id: string) => Promise<void>
  onUpdatePrize: (id: string, data: TNewPrize) => Promise<void>
  onDeletePrize: (id: string) => Promise<void>
}

const chipColor = (type: TTransaction['type'] | 'prize') => {
  if (type === 'deposit') return 'success' as const
  if (type === 'withdrawal') return 'warning' as const
  return 'info' as const
}

const borderColor = {
  deposit: '#4caf50',
  prize: '#0288d1',
  withdrawal: '#d32f2f',
}

const ActionButtons = ({
  onEdit,
  onDelete,
  mobileWhiteBg = false,
}: {
  onEdit: () => void
  onDelete: () => void
  mobileWhiteBg?: boolean
}) => (
  <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
    <IconButton
      size="small"
      aria-label="Edit"
      onClick={onEdit}
      sx={{
        color: 'primary.main',
        ...(mobileWhiteBg && { bgcolor: 'white' }),
        '&:hover, &:active': { bgcolor: 'primary.main', color: 'white' },
      }}
    >
      <EditOutlinedIcon fontSize="small" />
    </IconButton>
    <IconButton
      size="small"
      aria-label="Delete"
      onClick={onDelete}
      sx={{
        color: 'error.main',
        ...(mobileWhiteBg && { bgcolor: 'white' }),
        '&:hover, &:active': { bgcolor: 'error.main', color: 'white' },
      }}
    >
      <DeleteOutlineIcon fontSize="small" />
    </IconButton>
  </Stack>
)

const ActivityList = ({
  transactions,
  prizes,
  onUpdateTransaction,
  onDeleteTransaction,
  onUpdatePrize,
  onDeletePrize,
}: IActivityListProps) => {
  const [deleteTarget, setDeleteTarget] = useState<TActivityItem | null>(null)
  const [editTarget, setEditTarget] = useState<TActivityItem | null>(null)

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<TEditFormValues>({ mode: 'onChange' })

  const items: TActivityItem[] = [
    ...transactions.map((t) => ({ ...t, itemType: 'transaction' as const })),
    ...prizes.map((p) => ({ ...p, itemType: 'prize' as const })),
  ].sort((a, b) => a.date.localeCompare(b.date))

  const openEdit = (item: TActivityItem) => {
    setEditTarget(item)
    const { year, month } = fromYearMonth(item.date)
    reset({ year, month, amount: item.amount, ...('type' in item ? { type: item.type } : {}) })
  }

  const closeEdit = () => setEditTarget(null)

  const handleEditSubmit = async ({ month, year, amount, type }: TEditFormValues) => {
    if (!editTarget) return
    const date = toYearMonth(year, month)
    if (editTarget.itemType === 'transaction') {
      await onUpdateTransaction(editTarget.id, { date, amount, type })
    } else {
      await onUpdatePrize(editTarget.id, { date, amount })
    }
    closeEdit()
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    if (deleteTarget.itemType === 'transaction') {
      await onDeleteTransaction(deleteTarget.id)
    } else {
      await onDeletePrize(deleteTarget.id)
    }
    setDeleteTarget(null)
  }

  if (items.length === 0) {
    return <Typography color="text.secondary">No activity yet.</Typography>
  }

  const isTransaction = editTarget?.itemType === 'transaction'

  return (
    <>
      {/* Mobile: card list */}
      <Stack spacing={1.5} sx={{ display: { xs: 'flex', sm: 'none' } }}>
        {items.map((item) => {
          const itemKind = 'type' in item ? item.type : 'prize'
          const isWithdrawal = itemKind === 'withdrawal'
          const formattedAmount = `${isWithdrawal ? '-' : ''}${item.amount.toFixed(2)}`

          return (
            <Box
              key={`${item.itemType}-${item.id}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderLeft: `4px solid ${borderColor[itemKind]}`,
                borderRadius: 1,
                px: 2,
                py: 1.5,
                bgcolor: 'background.paper',
                boxShadow: 1,
              }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  {formatYearMonth(item.date)}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                  {itemKind}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'bold', color: isWithdrawal ? 'error.main' : 'inherit' }}
                >
                  {formattedAmount}
                </Typography>
              </Box>
              <ActionButtons
                onEdit={() => openEdit(item)}
                onDelete={() => setDeleteTarget(item)}
                mobileWhiteBg
              />
            </Box>
          )
        })}
      </Stack>

      {/* Tablet/desktop: table */}
      <Table
        size="small"
        sx={{
          display: { xs: 'none', sm: 'table' },
          '& .MuiTableCell-root': { fontSize: '1.125rem' },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Type</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell className="print-hide" />
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => {
            const itemKind = 'type' in item ? item.type : 'prize'
            const isWithdrawal = itemKind === 'withdrawal'
            const formattedAmount = `${isWithdrawal ? '-' : ''}${item.amount.toFixed(2)}`

            return (
              <TableRow key={`${item.itemType}-${item.id}`}>
                <TableCell>{formatYearMonth(item.date)}</TableCell>
                <TableCell>
                  <Chip
                    label={itemKind}
                    size="small"
                    color={chipColor(itemKind)}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right" sx={{ color: isWithdrawal ? 'error.main' : 'inherit' }}>
                  {formattedAmount}
                </TableCell>
                <TableCell align="right" className="print-hide">
                  <ActionButtons
                    onEdit={() => openEdit(item)}
                    onDelete={() => setDeleteTarget(item)}
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete {deleteTarget?.itemType}?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently remove the{' '}
            {deleteTarget && 'type' in deleteTarget ? deleteTarget.type : 'prize'} of £
            {deleteTarget?.amount.toFixed(2)} on {deleteTarget?.date.replace(/-/g, '/')}. This
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button color="error" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editTarget} onClose={closeEdit} fullWidth maxWidth="xs">
        <DialogTitle>Edit {editTarget?.itemType}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Stack direction="row" spacing={2}>
              <Controller
                name="month"
                control={control}
                rules={{ required: 'Month is required' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.month}>
                    <InputLabel id="edit-month-label">Month</InputLabel>
                    <Select
                      labelId="edit-month-label"
                      label="Month"
                      {...field}
                      value={field.value ?? ''}
                    >
                      {MONTHS.map((m) => (
                        <MenuItem key={m.value} value={m.value}>
                          {m.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
              <TextField
                label="Year"
                type="number"
                fullWidth
                slotProps={{ htmlInput: { min: 1956, max: new Date().getFullYear(), step: 1 } }}
                error={!!errors.year}
                helperText={errors.year?.message}
                {...register('year', {
                  required: 'Year is required',
                  min: { value: 1956, message: 'Year must be 1956 or later' },
                  max: { value: new Date().getFullYear(), message: 'Year cannot be in the future' },
                })}
              />
            </Stack>
            <TextField
              label="Amount (£)"
              type="number"
              slotProps={{
                htmlInput: { min: 0.01, max: isTransaction ? 50000 : 1000000, step: 0.01 },
              }}
              fullWidth
              error={!!errors.amount}
              helperText={errors.amount?.message}
              {...register('amount', {
                required: 'Amount is required',
                valueAsNumber: true,
                min: { value: 0.01, message: 'Must be greater than 0' },
                max: isTransaction
                  ? { value: 50000, message: 'Maximum holding is £50,000' }
                  : { value: 1000000, message: 'Maximum prize is £1,000,000' },
              })}
            />
            {isTransaction && (
              <Controller
                name="type"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel id="edit-type-label">Type</InputLabel>
                    <Select
                      labelId="edit-type-label"
                      label="Type"
                      {...field}
                      value={field.value ?? 'deposit'}
                    >
                      <MenuItem value="deposit">Deposit</MenuItem>
                      <MenuItem value="withdrawal">Withdrawal</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEdit}>Cancel</Button>
          <Button variant="contained" disabled={!isValid} onClick={handleSubmit(handleEditSubmit)}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ActivityList
