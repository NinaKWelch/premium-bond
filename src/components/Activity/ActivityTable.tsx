import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import type { TActivityItem, TTransaction } from '#types/bonds';
import { formatYearMonth } from '#utils/date';
import { displayLabel, ActionButtons } from './activityHelpers';

interface IActivityTableProps {
  items: TActivityItem[];
  onEdit: (item: TActivityItem) => void;
  onDelete: (item: TActivityItem) => void;
}

const chipColor = (type: TTransaction['type'] | 'prize') => {
  switch (type) {
    case 'deposit':
      return 'success';
    case 'withdrawal':
      return 'warning';
    case 'reinvestment':
      return 'secondary';
    default:
      return 'info';
  }
};

const ActivityTable = ({ items, onEdit, onDelete }: IActivityTableProps) => (
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
        const itemKind = 'type' in item ? item.type : 'prize';
        const isWithdrawal = itemKind === 'withdrawal';
        const formattedAmount = isWithdrawal
          ? `-£${item.amount.toFixed(2)}`
          : `£${item.amount.toFixed(2)}`;

        return (
          <TableRow key={`${item.itemType}-${item.id}`}>
            <TableCell>{formatYearMonth(item.date)}</TableCell>
            <TableCell>
              <Chip
                label={displayLabel(itemKind)}
                size="small"
                color={chipColor(itemKind)}
                variant="outlined"
              />
            </TableCell>
            <TableCell align="right" sx={{ color: isWithdrawal ? 'error.main' : 'inherit' }}>
              {formattedAmount}
            </TableCell>
            <TableCell align="right" className="print-hide">
              <ActionButtons onEdit={() => onEdit(item)} onDelete={() => onDelete(item)} />
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  </Table>
);

export default ActivityTable;
