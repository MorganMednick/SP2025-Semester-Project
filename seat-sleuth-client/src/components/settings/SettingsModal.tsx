import { Button, Text, Modal, PasswordInput, SegmentedControl, Stack, TextInput, Title, Group, Center } from "@mantine/core";
import { getUserInfo, updatePassword, updateUserInfo } from "../../api/functions/user";
import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { showMantineNotification } from "../../util/uiUtils";
import { ApiResponse } from "@shared/api/responses";

interface SettingsModalProps {
  opened: boolean;
  onClose: () => void;
}

export function SettingsModal({ opened, onClose }: SettingsModalProps) {

  const form = useForm({
    mode: 'controlled',
      initialValues: {
        name: "",
        email: "",
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
        notif: "",
      },

    validate: {
      email: (value: string) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Invalid email address'),
      newPassword: (value) =>
        changePassword && value.length < 6 ? "Password must be at least 6 characters" : null,
      confirmNewPassword: (value, values) =>
        changePassword && value !== values.newPassword ? "Passwords do not match" : null,
    }
  });

  const [changePassword, setChangePassword] = useState(false);

  const closeSettingsModal = () => {
    setChangePassword(false);
    onClose();
    form.reset()
  };

  const closeChangePasswordView = () => {
    setChangePassword(false);
    form.setValues({oldPassword: "", newPassword: "", confirmNewPassword: ""})
  };

  useEffect(() => {
    if (opened){
      getUserInfo()
        .then((res) => {
          form.setValues({"email": res.data?.email, "name": res.data?.name ?? "", "notif": res.data?.notif ? "EMAIL" : "OFF" });
      })
      .catch((err: Error) => console.error(err.message));
    }
  } , [opened]);

const handleSaveChanges = async () => {
  const validationResult = form.validate();
  if (!validationResult.hasErrors) {
    const { name, email, notif } = form.values;
    const notifBool = notif === "EMAIL";
    const response: ApiResponse<null> = await updateUserInfo({ name, email, notif: notifBool });
    if (response?.statusCode >= 200 && response.statusCode < 300) {
      closeSettingsModal();
      showMantineNotification({ message: `User settings saved successfully.`, type: 'INFO' });
    } else {
      showMantineNotification({ message: `Error saving user settings.`, type: 'ERROR' });
    }
  }
};

const handleUpdatePassword = async () => {
  const validationResult = form.validate();
  if (!validationResult.hasErrors) {
    const {oldPassword, newPassword } = form.values;
    const response: ApiResponse<null> = await updatePassword( {oldPassword, newPassword} );
    if (response?.statusCode >= 200 && response.statusCode < 300) {
      closeSettingsModal();
      showMantineNotification({ message: `Password updated successfully.`, type: 'INFO' });
    } else {
      showMantineNotification({ message: response.message, type: 'ERROR' });
    }
  }
};

  return (   
    <Modal opened={opened} onClose={closeSettingsModal} size="lg" >
         
        {!changePassword ? ( 
          <Stack gap="10px" mx="30" >
            <Title order={2}>Settings</Title>
        
            <TextInput label="Name" placeholder="What's your name?" {...form.getInputProps("name")} />
            <TextInput label="Email" type="email" {...form.getInputProps("email")} />
            <Stack gap="5">
              <PasswordInput disabled label="Password" placeholder="••••••••••••••" />
              <Text size="xs" ta="right" style={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => setChangePassword(!changePassword)}>
                  Reset Password 
              </Text>
            </Stack>
            <Stack gap ="0">
              <Text size="sm" fw={500} > Watchlist notifications </Text>
              <SegmentedControl size="xs" fullWidth data={['EMAIL', 'OFF']} {...form.getInputProps("notif")}/>
            </Stack>
            <Center pt="20">
              <Button w="200" type="submit" size="md" onClick={handleSaveChanges}>
                Save changes
              </Button>
            </Center>
          </Stack>
        ) : (
          <Stack gap="10px" mx="30" >
            <Title order={2}>Change password</Title>
            <PasswordInput  label="Old password" {...form.getInputProps("oldPassword")} />
            <PasswordInput label="New password" {...form.getInputProps("newPassword")} />
            <PasswordInput label="Confirm new password" {...form.getInputProps("confirmNewPassword")} />
            <Group justify="center" gap ="20" pt="20">
              <Button onClick={ closeChangePasswordView } size="md" variant="light"> 
                Cancel 
              </Button>
              <Button type="submit" size="md" onClick={handleUpdatePassword}>
                Update password
              </Button>                         
              </Group> 
          </Stack>
        )}
        
    </Modal>
  );
}