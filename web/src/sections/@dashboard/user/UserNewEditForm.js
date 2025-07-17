import PropTypes from 'prop-types'
import * as Yup from 'yup'
import { useEffect, useMemo } from 'react'
import { useSnackbar } from 'notistack'
// form
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
// @mui
import { LoadingButton } from '@mui/lab'
import {
  Box,
  Card,
  Stack,
  MenuItem,
  Checkbox,
  ListItemText,
  FormControl,
  InputLabel,
  Autocomplete,
  TextField
} from '@mui/material'
import Select from '@mui/material/Select'

// components
import { FormProvider, RHFTextField } from 'src/components/hook-form'
import { registerUser, updateUser } from 'src/apis/user'
import useRole from 'src/hooks/queries/useRole'
import { useQueryClient } from '@tanstack/react-query'
import useDepartment from 'src/hooks/queries/useDepartment'

// ----------------------------------------------------------------------

UserNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object
}

export default function UserNewEditForm({ isEdit = false, currentUser }) {
  const queryClient = useQueryClient()

  const { enqueueSnackbar } = useSnackbar()

  const {
    data: departmentsData,
    isLoading: isDepartmentsLoading,
    isError,
    error
  } = useDepartment.getAll()

  const {
    data: rolesData,
    isLoading: isRolesLoading,
    isError: isRolesError,
    error: rolesError
  } = useRole.getAll()

  const NewUserSchema = Yup.object().shape({
    identification: Yup.string().required('Identification is required'),
    email: Yup.string().required('Email is required').email(),
    name: Yup.string().required('Name is required'),
    roleIds: Yup.array()
      .of(Yup.number())
      .min(1, 'At least one role is required'),
    departmentId: Yup.number().required('Department is required')
  })

  const defaultValues = useMemo(
    () => ({
      identification: currentUser?.identification_number || '',
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      roleIds: currentUser?.roles?.map((role) => role.id) || [],
      departmentId: currentUser?.department?.id || ''
    }),
    [currentUser]
  )

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues
  })

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty, isValid }
  } = methods

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  const onSubmit = async (values) => {
    try {
      if (isEdit) {
        await updateUser(currentUser.id, {
          name: values.name,
          roleIds: values.roleIds,
          departmentId: values.departmentId
        })
      } else {
        await registerUser({
          identification_number: values.identification,
          email: values.email.toLowerCase(),
          name: values.name,
          roleIds: values.roleIds,
          departmentId: values.departmentId
        })
      }
      await queryClient.invalidateQueries({
        queryKey: ['users/students']
      })
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!')
    } catch (error) {
      enqueueSnackbar(error.response?.data.message, { variant: 'error' })
      reset(defaultValues)
      console.error(error)
    }
  }

  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: 'grid',
            columnGap: 2,
            rowGap: 3,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)'
            }
          }}
        >
          {!isEdit && (
            <>
              <RHFTextField
                name="identification"
                label="Identification Number"
              />
              <RHFTextField name="email" label="Email" />
            </>
          )}

          <RHFTextField name="name" label="Full Name" />

          <Controller
            name="roleIds"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="roles-label">Roles</InputLabel>
                <Select
                  {...field}
                  labelId="roles-label"
                  multiple
                  label="Roles"
                  renderValue={(selected) =>
                    selected
                      .map((id) => {
                        const role = rolesData?.find((role) => role.id === id)
                        if (role?.name.toLowerCase() === 'hod') {
                          return 'Head of Department'
                        }
                        return (
                          role?.name.charAt(0).toUpperCase() +
                          role?.name.slice(1)
                        )
                      })
                      .join(', ')
                  }
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 48 * 4.5 + 8,
                        width: 250
                      }
                    }
                  }}
                >
                  {Array.isArray(rolesData) &&
                    rolesData.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        <Checkbox checked={field.value.indexOf(role.id) > -1} />
                        <ListItemText
                          primary={
                            role.name.toLowerCase() === 'hod'
                              ? 'Head of Department'
                              : role.name.charAt(0).toUpperCase() +
                                role.name.slice(1)
                          }
                        />
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name="departmentId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <Autocomplete
                  {...field}
                  options={
                    Array.isArray(departmentsData?.data)
                      ? departmentsData.data
                      : []
                  }
                  getOptionLabel={(option) =>
                    `${option.code_name} - ${option.full_name}`
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Department" />
                  )}
                  onChange={(_, newValue) => {
                    field.onChange(newValue ? newValue.id : null)
                  }}
                  value={
                    departmentsData?.data?.find(
                      (dept) => dept.id === field.value
                    ) || null
                  }
                />
              </FormControl>
            )}
          />
        </Box>

        <Stack
          direction="row"
          spacing={2}
          alignItems="flex-end"
          justifyContent="flex-end"
          sx={{ mt: 3 }}
        >
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={
              !isValid || !isDirty || isSubmitting || (isEdit && !isDirty)
            }
          >
            {!isEdit ? 'Create User' : 'Save Changes'}
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  )
}
