import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Select,
  Stack,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import type { FormikConfig } from 'formik';
import * as React from 'react';
import { HiPencilAlt, HiPlus } from 'react-icons/hi';
import * as Yup from 'yup';
import { Prisma } from '@prisma/client';
import { Item } from 'framer-motion/types/components/Reorder/Item';

const ChannelDataItemSchema = Yup.lazy((item) => {
  const base = {
    property: Yup.string().required('Property name is required.'),
    type: Yup.string().oneOf(
      ['boolean', 'number', 'string', 'object'],
      'Value type must be String, Number, Boolean, Object, or Array.'
    ),
  };
  switch (item.type) {
    case 'boolean':
      return Yup.object({
        ...base,
        value: Yup.boolean()
          .typeError('Value must be a boolean')
          .required('Boolean value is required'),
      });
    case 'number':
      return Yup.object({
        ...base,
        value: Yup.number()
          .typeError('Value must be a number')
          .required('Number value is required'),
      });
    case 'string':
      return Yup.object({
        ...base,
        value: Yup.string().required('String value is required'),
      });
  }
  return Yup.object({
    ...base,
    value: Yup.string()
      .test('is-valid-json', 'Value must be valid JSON', (value) => {
        if (!value) return false;
        try {
          JSON.parse(value);
          return true;
        } catch (error) {
          return false;
        }
      })
      .required('JSON Object or Array value is required'),
  });
});

type ChannelDataItem = {
  property: string;
  value: Prisma.JsonValue;
};

type ChannelDataItemDrawerProps =
  | {
      mode: 'create';
      onCreate: (values: ChannelDataItem) => Promise<void>;
    }
  | {
      mode: 'edit';
      values: ChannelDataItem;
      onUpdate: (values: ChannelDataItem) => Promise<void>;
      onDelete: () => Promise<void>;
    };

function castChannelDataItem(item: ChannelDataItem) {
  switch (typeof item.value) {
    case 'number':
      return {
        ...item,
        type: 'number',
      };
    case 'boolean':
      return {
        ...item,
        type: 'boolean',
      };
    case 'string':
      return {
        ...item,
        type: 'string',
      };
  }
  return {
    ...item,
    value: JSON.stringify(item.value),
    type: 'object',
  };
}

export const ChannelDataItemDrawer = (props: ChannelDataItemDrawerProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstField = React.useRef<HTMLInputElement>(null);
  const toast = useToast();

  const onSubmit = props.mode == 'create' ? props.onCreate : props.onUpdate;

  const [isDeleting, setIsDeleting] = React.useState(false);

  const initialValues =
    props.mode == 'create'
      ? {
          property: '',
          value: '',
          type: 'string',
        }
      : {
          property: castChannelDataItem(props.values).property,
          value: castChannelDataItem(props.values).value,
          type: castChannelDataItem(props.values).type,
        };

  return (
    <>
      {props.mode == 'create' ? (
        <Button
          leftIcon={<HiPlus />}
          variant="outline"
          size="sm"
          onClick={onOpen}
        >
          New value
        </Button>
      ) : (
        <IconButton
          icon={<HiPencilAlt />}
          variant="outline"
          size="sm"
          aria-label="Edit"
          onClick={onOpen}
        />
      )}

      <Drawer
        isOpen={isOpen}
        size="lg"
        placement="right"
        initialFocusRef={firstField}
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            {props.mode == 'create' ? 'Add a new value' : 'Edit value'}
          </DrawerHeader>
          <Formik
            initialValues={initialValues}
            validationSchema={ChannelDataItemSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const item = ChannelDataItemSchema.cast(values);
                await onSubmit({
                  property: item.property!,
                  value:
                    item.type === 'object'
                      ? JSON.parse(item.value as string)
                      : item.value,
                });
                onClose();
              } catch (error) {
                if (error instanceof Error) {
                  toast({
                    title: error.message,
                    status: 'error',
                    isClosable: true,
                  });
                }
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <DrawerBody>
                  <Stack spacing="24px">
                    {props.mode == 'create' && (
                      <Field name="type">
                        {({ field }: FieldProps<string>) => (
                          <FormControl
                            isInvalid={!!(errors.type && touched.type)}
                          >
                            <FormLabel htmlFor="property">Property</FormLabel>
                            <Select {...field} id="type">
                              <option value="string">String</option>
                              <option value="number">Number</option>
                              <option value="boolean">Boolean</option>
                              <option value="object">Object or Array</option>
                            </Select>
                            {errors.type && touched.type ? (
                              <FormErrorMessage lineHeight={'normal'}>
                                {errors.type}
                              </FormErrorMessage>
                            ) : (
                              <FormHelperText>
                                Choose a value type.
                              </FormHelperText>
                            )}
                          </FormControl>
                        )}
                      </Field>
                    )}
                    <Field name="property">
                      {({ field }: FieldProps<string>) => (
                        <FormControl
                          isInvalid={!!(errors.property && touched.property)}
                        >
                          <FormLabel htmlFor="property">Property</FormLabel>
                          <Input
                            {...field}
                            id="property"
                            placeholder="my_value"
                          />
                          {errors.property && touched.property ? (
                            <FormErrorMessage lineHeight={'normal'}>
                              {errors.property}
                            </FormErrorMessage>
                          ) : (
                            <FormHelperText>
                              Enter a property name.
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    </Field>
                    <Field name="value">
                      {({ field }: FieldProps<string>) => (
                        <FormControl
                          isInvalid={!!(errors.value && touched.value)}
                        >
                          <FormLabel htmlFor="value">Value</FormLabel>
                          <Input {...field} id="value" />
                          {errors.value && touched.value ? (
                            <FormErrorMessage lineHeight={'normal'}>
                              {errors.value}
                            </FormErrorMessage>
                          ) : (
                            <FormHelperText>Enter the value.</FormHelperText>
                          )}
                        </FormControl>
                      )}
                    </Field>
                  </Stack>
                </DrawerBody>
                <DrawerFooter borderTopWidth="1px">
                  <Flex
                    w="100%"
                    justifyContent={'space-between'}
                    flexDirection="row-reverse"
                  >
                    <HStack spacing="3">
                      <Button variant="outline" onClick={onClose}>
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        colorScheme="blue"
                        isLoading={isSubmitting}
                      >
                        {props.mode == 'create' ? 'Submit' : 'Update'}
                      </Button>
                    </HStack>
                    {props.mode == 'edit' && (
                      <Button
                        colorScheme="red"
                        isLoading={isDeleting}
                        onClick={async () => {
                          if (
                            typeof window !== 'undefined' &&
                            window.confirm(
                              'Are you sure you wish to delete this value?'
                            )
                          ) {
                            setIsDeleting(true);
                            try {
                              await props.onDelete();
                              onClose();
                            } catch (error) {
                              if (error instanceof Error) {
                                toast({
                                  title: error.message,
                                  status: 'error',
                                  isClosable: true,
                                });
                              }
                            } finally {
                              setIsDeleting(false);
                            }
                          }
                        }}
                      >
                        Delete
                      </Button>
                    )}
                  </Flex>
                </DrawerFooter>
              </Form>
            )}
          </Formik>
        </DrawerContent>
      </Drawer>
    </>
  );
};
