import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Box,
  Button,
  Paper,
  TextField,
  IconButton,
  Typography,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

interface FormField {
  fieldType: "text" | "email" | "number" | "select";
  label: string;
  value: string;
  options?: string[]; // For select fields
}

interface DynamicFormData {
  formTitle: string;
  fields: FormField[];
}

const DynamicForm = () => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<DynamicFormData>({
    defaultValues: {
      formTitle: "",
      fields: [
        {
          fieldType: "text",
          label: "",
          value: "",
          options: [],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  const watchFieldArray = watch("fields");
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const onSubmit = (data: DynamicFormData) => {
    console.log("Form Data:", data);
    // Handle form submission here
  };

  const addNewField = () => {
    append({
      fieldType: "text",
      label: "",
      value: "",
      options: [],
    });
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h5" gutterBottom>
        Dynamic Form Builder
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          label="Form Title"
          {...register("formTitle", { required: "Form title is required" })}
          error={!!errors.formTitle}
          helperText={errors.formTitle?.message}
          sx={{ mb: 3 }}
        />

        {controlledFields.map((field, index) => (
          <Stack
            key={field.id}
            spacing={2}
            sx={{ mb: 3, p: 2, bgcolor: "background.paper", borderRadius: 1 }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <FormControl fullWidth>
                <InputLabel>Field Type</InputLabel>
                <Select
                  label="Field Type"
                  {...register(`fields.${index}.fieldType` as const)}
                  defaultValue="text"
                >
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="number">Number</MenuItem>
                  <MenuItem value="select">Select</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Field Label"
                {...register(`fields.${index}.label` as const, {
                  required: "Label is required",
                })}
                error={!!errors.fields?.[index]?.label}
                helperText={errors.fields?.[index]?.label?.message}
              />

              <IconButton
                onClick={() => remove(index)}
                disabled={fields.length === 1}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Stack>

            {field.fieldType === "select" && (
              <TextField
                fullWidth
                label="Options (comma-separated)"
                {...register(`fields.${index}.options` as const)}
                helperText="Enter options separated by commas"
              />
            )}

            <TextField
              fullWidth
              label="Default Value"
              type={field.fieldType === "number" ? "number" : "text"}
              {...register(`fields.${index}.value` as const)}
            />
          </Stack>
        ))}

        <Button
          startIcon={<AddIcon />}
          onClick={addNewField}
          variant="outlined"
          sx={{ mb: 2 }}
        >
          Add Field
        </Button>

        <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            Save Form
          </Button>
          <Button variant="outlined" onClick={() => reset()}>
            Reset
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default DynamicForm;
