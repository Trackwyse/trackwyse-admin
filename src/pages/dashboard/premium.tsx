/*
 * Created on Fri Feb 03 2023
 * Created by JS00001
 *
 * Copyright (c) 2023 Trackwyse
 */

import { useState } from "react";
import { useFormik } from "formik";
import Calendar from "react-calendar";
import { toast as Toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

import api from "@/api";
import withAuth from "@/hoc/withAuth";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Layout from "@/components/Layout";
import errorHandler from "@/lib/errorHandler";

const DashboardPremiumPage: React.FC = () => {
  const [expiresIn, setExpiresIn] = useState<number | null>(null);

  const setPremiumMutation = useMutation({
    mutationFn: (input: SetPremiumInput) => {
      return api.setPremium(input);
    },
  });

  const setPremiumForm = useFormik({
    initialValues: {
      id: "",
    },
    onSubmit: (values) => {
      const input: SetPremiumInput = {
        id: values.id,
        expiresIn: expiresIn || undefined,
      };

      setPremiumMutation.mutate(input, {
        onSuccess: () => {
          Toast.success("Premium request successful.");
          setPremiumForm.resetForm();
        },
        onError: (err) => {
          errorHandler.handle(err, setPremiumForm);
        },
      });
    },
  });

  const handleDateChange = (date: Date) => {
    // get the seconds from the current date to the date selected
    const seconds = Math.floor((date.getTime() - Date.now()) / 1000);
    setExpiresIn(seconds);
  };

  return (
    <Layout>
      <Layout.Header>Manage Premium</Layout.Header>
      <Layout.Content>
        <div className="w-96">
          <Input
            placeholder="User ID"
            error={setPremiumForm.errors.id}
            value={setPremiumForm.values.id}
            disabled={setPremiumMutation.isLoading}
            onChange={setPremiumForm.handleChange("id")}
          />

          <Calendar
            className="my-4"
            minDate={new Date()}
            onChange={handleDateChange}
            // default value to one day from now
            defaultValue={new Date(Date.now() + 86400000)}
          />

          <Button
            onClick={setPremiumForm.handleSubmit}
            loading={setPremiumMutation.isLoading}
            disabled={!setPremiumForm.dirty}
            className="w-full"
          >
            Submit Premium Request
          </Button>
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default withAuth(DashboardPremiumPage);
