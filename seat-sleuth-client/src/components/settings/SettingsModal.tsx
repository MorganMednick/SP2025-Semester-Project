import { Button, Text, Modal, PasswordInput, SegmentedControl, Stack, TextInput, Title, Group } from "@mantine/core";
import { getUserInfo } from "../../api/functions/user";
import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";

interface SettingsModalProps {
  opened: boolean;
  onClose: () => void;
}

export function SettingsModal({ opened, onClose }: SettingsModalProps) {

  const form = useForm({
    mode: 'uncontrolled',
      initialValues: {
        name: "",
        email: "",
        password: "",
        newPassword: "",
        confirmNewPassword: "",
        notifications: null,
      },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      newPassword: (value) =>
        changePassword && value.length < 6 ? "Password must be at least 6 characters" : null,
      confirmNewPassword: (value, values) =>
        changePassword && value !== values.newPassword ? "Passwords do not match" : null,
    }
  });

  const [changePassword, setChangePassword] = useState(false);
  
  const closeSettingsModel = () => {
    setChangePassword(false);
    onClose();
    form.reset()
  };

  useEffect(() => {
    if (opened){
      // setLoading(true);
      getUserInfo()
        .then((res) => {
          form.setValues(res.data);
          console.log(res.data || "no data");
      })
      //.finally(() => setLoading(false));
    }
  } , [opened]);

  return (   
    <Modal opened={opened} onClose={closeSettingsModel} size="lg" >
      <Stack gap="10px" mx="30" >
        <Title order={2}>Settings</Title>
       
        <TextInput label="Name" placeholder="What's your name?" {...form.getInputProps("name")} />
        <TextInput label="Email" type="email" {...form.getInputProps("email")} />
        
        {!changePassword ? ( 
          <Stack gap="0">
            <PasswordInput disabled label="Password" placeholder="••••••••" {...form.getInputProps("password")} />
            <Text size="xs" ta="right" style={{ cursor: "pointer", textDecoration: "underline" }}
                onClick={() => setChangePassword(!changePassword)}>
                Reset Password 
            </Text>
          </Stack>
        ) : (
          <Stack>
            <PasswordInput  label="Old password" {...form.getInputProps("password")} />
            <PasswordInput label="New password" {...form.getInputProps("newPassword")} />
            <PasswordInput label="Confirm new password" {...form.getInputProps("confirmNewPassword")} />
          </Stack>
        )}
        
        <Stack gap ="0">
          <Text size="sm" fw={500} > Watchlist notifications </Text>
          <SegmentedControl size="xs" fullWidth data={['EMAIL', 'OFF']} defaultValue={form.getInputProps("notifications").defaultValue ?? "OFF"}/>
        </Stack>
        
        <Group justify="center" m ="20">       
          { changePassword ? (
          <Button onClick={closeSettingsModel} size="md" color="red"> 
            Cancel 
          </Button> ) : ""}
          <Button type="submit" size="md" onClick={() =>form.onSubmit((values) => console.log(values))}>
            Save Changes
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}