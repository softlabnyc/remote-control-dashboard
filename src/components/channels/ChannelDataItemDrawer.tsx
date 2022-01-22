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
import {
  CastDataItem,
  DataItem,
  EditableDataItem,
  fromCastDataItem,
  marshall,
  unmarshall,
} from '@/lib/dataItem';

const ChannelDataItemSchema = Yup.lazy((item: EditableDataItem) => {
  const base = {
    name: Yup.string().required('Property name is required.'),
    editableType: Yup.string().oneOf(
      ['boolean', 'number', 'string', 'object'],
      'Type of value must be String, Number, Boolean, Object, or Array.'
    ),
  };
  switch (item.editableType) {
    case 'boolean':
      return Yup.object({
        ...base,
        editableValue: Yup.boolean()
          .typeError('Value must be a boolean')
          .required('Boolean value is required'),
      });
    case 'number':
      return Yup.object({
        ...base,
        editableValue: Yup.number()
          .typeError('Value must be a number')
          .required('Number value is required'),
      });
    case 'string':
      return Yup.object({
        ...base,
        editableValue: Yup.string().required('String value is required'),
      });
    case 'null':
      return Yup.object({
        ...base,
        editableValue: Yup.mixed().test(
          'is-null',
          'Value must be null',
          (editableValue) => editableValue === null
        ),
      });
  }
  return Yup.object({
    ...base,
    editableValue: Yup.string()
      .test('is-valid-json', 'Value must be valid JSON', (editableValue) => {
        if (!editableValue) return false;
        try {
          JSON.parse(editableValue);
          return true;
        } catch (error) {
          return false;
        }
      })
      .required('JSON Object or Array value is required'),
  });
});

type ChannelDataItemDrawerProps =
  | {
      mode: 'create';
      onCreate: (item: EditableDataItem) => Promise<void>;
    }
  | {
      mode: 'edit';
      item: EditableDataItem;
      onUpdate: (item: EditableDataItem) => Promise<void>;
      onDelete: () => Promise<void>;
    };

export const ChannelDataItemDrawer = (props: ChannelDataItemDrawerProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstField = React.useRef<HTMLInputElement>(null);
  const toast = useToast();

  const onSubmit = props.mode == 'create' ? props.onCreate : props.onUpdate;

  const [isDeleting, setIsDeleting] = React.useState(false);

  const initialValues: {
    name: EditableDataItem['name'];
    editableValue: EditableDataItem['editableValue'];
    editableType: EditableDataItem['editableType'];
  } =
    props.mode == 'create'
      ? {
          name: '',
          editableValue: '',
          editableType: 'string',
        }
      : props.item;

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
                const item = fromCastDataItem(
                  ChannelDataItemSchema.cast(values) as CastDataItem
                );
                await onSubmit(item);
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
            {({ errors, touched, isSubmitting, values }) => (
              <Form>
                <DrawerBody>
                  <Stack spacing="24px">
                    {props.mode == 'create' && (
                      <Field name="editableType">
                        {({ field }: FieldProps<string>) => (
                          <FormControl
                            isInvalid={
                              !!(errors.editableType && touched.editableType)
                            }
                          >
                            <FormLabel htmlFor="editableType">Type</FormLabel>
                            <Select {...field} id="editableType">
                              <option value="string">String</option>
                              <option value="number">Number</option>
                              <option value="boolean">Boolean</option>
                              <option value="object">Object or Array</option>
                            </Select>
                            {errors.editableType && touched.editableType ? (
                              <FormErrorMessage lineHeight={'normal'}>
                                {errors.editableType}
                              </FormErrorMessage>
                            ) : (
                              <FormHelperText>
                                Choose a type for the value.
                              </FormHelperText>
                            )}
                          </FormControl>
                        )}
                      </Field>
                    )}
                    <Field name="name">
                      {({ field }: FieldProps<string>) => (
                        <FormControl
                          isInvalid={!!(errors.name && touched.name)}
                        >
                          <FormLabel htmlFor="name">Name</FormLabel>
                          <Input {...field} id="name" placeholder="my_value" />
                          {errors.name && touched.name ? (
                            <FormErrorMessage lineHeight={'normal'}>
                              {errors.name}
                            </FormErrorMessage>
                          ) : (
                            <FormHelperText>
                              Enter a property name.
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    </Field>
                    {values.editableType !== 'null' && (
                      <Field name="editableValue">
                        {({ field }: FieldProps<string>) => (
                          <FormControl
                            isInvalid={
                              !!(errors.editableValue && touched.editableValue)
                            }
                          >
                            <FormLabel htmlFor="editableValue">Value</FormLabel>
                            <Input {...field} id="editableValue" />
                            {errors.editableValue && touched.editableValue ? (
                              <FormErrorMessage lineHeight={'normal'}>
                                {errors.editableValue}
                              </FormErrorMessage>
                            ) : (
                              <FormHelperText>Enter the value.</FormHelperText>
                            )}
                          </FormControl>
                        )}
                      </Field>
                    )}
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
