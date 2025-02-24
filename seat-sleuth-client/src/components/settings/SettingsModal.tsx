import {
  Button,
  Text,
  Modal,
  PasswordInput,
  SegmentedControl,
  Stack,
  TextInput,
  Title,
  Group,
  Center,
  Loader,
} from '@mantine/core';
import { getUserInfo, updatePassword, updateUserInfo } from '../../api/functions/user';
import { useState } from 'react';
import { useForm } from '@mantine/form';
import { showMantineNotification } from '../../util/uiUtils';
import { ApiResponse } from '@shared/api/responses';
import { responseIsOk } from '../../util/apiUtils';
import { useQuery, useMutation } from 'react-query';

interface SettingsModalProps {
  opened: boolean;
  onClose: () => void;
}

export function SettingsModal({ opened, onClose }: SettingsModalProps) {
  const [changePassword, setChangePassword] = useState(false);

  const form = useForm({
    mode: 'controlled',
    initialValues: {
      name: '',
      email: '',
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      notif: '',
    },
    validate: {
      email: (value: string) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Invalid email address'),
      newPassword: (value) =>
        changePassword && value.length < 6 ? 'Password must be at least 6 characters' : null,
      confirmNewPassword: (value, values) =>
        changePassword && value !== values.newPassword ? 'Passwords do not match' : null,
    },
  });

  // Fetch user info only when the modal is opened
  const {
    data: userInfo,
    isLoading: userLoading,
    error: userError,
  } = useQuery('userInfo', () => getUserInfo().then((res) => res.data), {
    enabled: opened,
    onSuccess: (data) => {
      form.setValues({
        email: data?.email,
        name: data?.name ?? '',
        notif: data?.notif ? 'EMAIL' : 'OFF',
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    },
    onError: (err: Error) => {
      console.error(err.message);
    },
  });

  // Mutation for updating user info
  const updateUserInfoMutation = useMutation(
    ({ name, email, notif }: { name: string; email: string; notif: boolean }) =>
      updateUserInfo({ name, email, notif }),
    {
      onSuccess: (response: ApiResponse<null>) => {
        if (responseIsOk(response)) {
          closeSettingsModal();
          showMantineNotification({ message: 'User settings saved successfully.', type: 'INFO' });
        } else {
          showMantineNotification({ message: 'Error saving user settings.', type: 'ERROR' });
        }
      },
      onError: (error: Error) => {
        showMantineNotification({ message: error.message, type: 'ERROR' });
      },
    },
  );

  // Mutation for updating password
  const updatePasswordMutation = useMutation(
    ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) =>
      updatePassword({ oldPassword, newPassword }),
    {
      onSuccess: (response: ApiResponse<null>) => {
        if (responseIsOk(response)) {
          closeSettingsModal();
          showMantineNotification({ message: 'Password updated successfully.', type: 'INFO' });
        } else {
          showMantineNotification({ message: response.message, type: 'ERROR' });
        }
      },
      onError: (error: Error) => {
        showMantineNotification({ message: error.message, type: 'ERROR' });
      },
    },
  );

  const closeSettingsModal = () => {
    setChangePassword(false);
    onClose();
    form.reset();
  };

  const closeChangePasswordView = () => {
    setChangePassword(false);
    form.setValues({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
  };

  const handleSaveChanges = () => {
    const validationResult = form.validate();
    if (!validationResult.hasErrors) {
      const { name, email, notif } = form.values;
      const notifBool = notif === 'EMAIL';
      updateUserInfoMutation.mutate({ name, email, notif: notifBool });
    }
  };

  const handleUpdatePassword = () => {
    const validationResult = form.validate();
    if (!validationResult.hasErrors) {
      const { oldPassword, newPassword } = form.values;
      updatePasswordMutation.mutate({ oldPassword, newPassword });
    }
  };

  return (
    <Modal opened={opened} onClose={closeSettingsModal} size="lg">
      {userLoading ? (
        <Center>
          <Loader />
        </Center>
      ) : (
        <>
          {userError && (
            <Text c="red" ta="center">
              Error loading user info.
            </Text>
          )}
          {!changePassword ? (
            <Stack gap="10px" mx="30">
              <Title order={2}>Settings</Title>
              <TextInput
                label="Name"
                placeholder="What's your name?"
                {...form.getInputProps('name')}
              />
              <TextInput label="Email" type="email" {...form.getInputProps('email')} />
              <Stack gap="5">
                <PasswordInput disabled label="Password" placeholder="••••••••••••••" />
                <Text
                  size="xs"
                  ta="right"
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => setChangePassword(true)}
                >
                  Reset Password
                </Text>
              </Stack>
              <Stack gap="0">
                <Text size="sm" fw={500}>
                  Watchlist notifications
                </Text>
                <SegmentedControl
                  size="xs"
                  fullWidth
                  data={['EMAIL', 'OFF']}
                  {...form.getInputProps('notif')}
                />
              </Stack>
              <Center pt="20">
                <Button
                  w="200"
                  type="submit"
                  size="md"
                  onClick={handleSaveChanges}
                  loading={updateUserInfoMutation.isLoading}
                >
                  Save changes
                </Button>
              </Center>
            </Stack>
          ) : (
            <Stack gap="10px" mx="30">
              <Title order={2}>Change password</Title>
              <PasswordInput label="Old password" {...form.getInputProps('oldPassword')} />
              <PasswordInput label="New password" {...form.getInputProps('newPassword')} />
              <PasswordInput
                label="Confirm new password"
                {...form.getInputProps('confirmNewPassword')}
              />
              <Group justify="center" gap="20" pt="20">
                <Button onClick={closeChangePasswordView} size="md" variant="light">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="md"
                  onClick={handleUpdatePassword}
                  loading={updatePasswordMutation.isLoading}
                >
                  Update password
                </Button>
              </Group>
            </Stack>
          )}
        </>
      )}
    </Modal>
  );
}
