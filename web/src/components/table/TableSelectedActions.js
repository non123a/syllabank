import PropTypes from 'prop-types'
// @mui
import { Button, Checkbox, Typography, Stack } from '@mui/material'

// ----------------------------------------------------------------------

TableSelectedActions.propTypes = {
  dense: PropTypes.bool,
  actions: PropTypes.node,
  rowCount: PropTypes.number,
  numSelected: PropTypes.number,
  onSelectAllRows: PropTypes.func
}

export default function TableSelectedActions({
  dense,
  actions,
  rowCount,
  numSelected,
  onSelectAllRows
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        px: 2,
        top: 0,
        right: 8,
        zIndex: 9,
        height: 58,
        borderRadius: 1,
        position: 'absolute',
        width: 'calc(100% - 16px)',
        bgcolor: 'secondary.lighter',
        ...(dense && {
          pl: 1,
          height: 38
        })
      }}
    >
      <Checkbox
        indeterminate={numSelected > 0 && numSelected < rowCount}
        checked={rowCount > 0 && numSelected === rowCount}
        onChange={(event) => onSelectAllRows(event.target.checked)}
      />

      <Stack direction="row" alignItems="center" gap={1}>
        <Typography
          variant="subtitle1"
          sx={{
            ml: 2,
            flexGrow: 1,
            color: 'primary.main',
            ...(dense && {
              ml: 3
            })
          }}
        >
          {numSelected} selected
        </Typography>
        {numSelected > 0 && numSelected < rowCount && (
          <Button
            sx={{
              fontSize: 12,
              p: '4px 4px',
              textDecoration: 'underline'
            }}
            color="error"
            size="small"
            onClick={() => onSelectAllRows(false)}
            variant="text"
          >
            Clear?
          </Button>
        )}
      </Stack>

      {actions && actions}
    </Stack>
  )
}
