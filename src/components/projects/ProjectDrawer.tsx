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
  Input,
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
import { Project } from '@prisma/client';

const CreateProjectSchema = Yup.object({
  name: Yup.string().required('Project name is required.'),
  location: Yup.string(),
  description: Yup.string(),
  client: Yup.string(),
});

type CreateProject = Yup.InferType<typeof CreateProjectSchema>;

type ProjectDrawerProps =
  | {
      mode: 'create';
      onCreate: (values: CreateProject) => Promise<void>;
    }
  | {
      mode: 'edit';
      values: Project;
      onUpdate: (values: CreateProject) => Promise<void>;
      onDelete: () => Promise<void>;
    };

function ProjectDrawer(props: ProjectDrawerProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstField = React.useRef<HTMLInputElement>(null);

  const toast = useToast();

  const onSubmit = props.mode == 'create' ? props.onCreate : props.onUpdate;

  const [isDeleting, setIsDeleting] = React.useState(false);

  return (
    <>
      {props.mode == 'create' ? (
        <Button
          leftIcon={<HiPlus />}
          colorScheme="blue"
          fontSize="sm"
          onClick={onOpen}
        >
          New project
        </Button>
      ) : (
        <Button
          leftIcon={<HiPencilAlt />}
          variant="outline"
          fontSize="sm"
          onClick={onOpen}
        >
          Edit
        </Button>
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
            {props.mode == 'create' ? 'Add a new project' : 'Edit project'}
          </DrawerHeader>
          <Formik
            initialValues={
              props.mode == 'create'
                ? {
                    name: '',
                    client: '',
                    location: '',
                    description: '',
                  }
                : {
                    name: props.values.name ?? '',
                    client: props.values.client ?? '',
                    location: props.values.location ?? '',
                    description: props.values.description ?? '',
                  }
            }
            validationSchema={CreateProjectSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await onSubmit(values);
                onClose();
              } catch (error) {
                setSubmitting(false);
                if (error instanceof Error) {
                  toast({
                    title: error.message,
                    status: 'error',
                    isClosable: true,
                  });
                }
              }
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <DrawerBody>
                  <Stack spacing="24px">
                    <Field name="name">
                      {({ field }: FieldProps<string>) => (
                        <FormControl
                          isInvalid={!!(errors.name && touched.name)}
                        >
                          <FormLabel htmlFor="name">Name</FormLabel>
                          <Input
                            {...field}
                            id="name"
                            placeholder="Public Art Installation"
                          />
                          {errors.name && touched.name ? (
                            <FormErrorMessage lineHeight={'normal'}>
                              {errors.name}
                            </FormErrorMessage>
                          ) : (
                            <FormHelperText>
                              Enter the name of the project.
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    </Field>
                    <Field name="client">
                      {({ field }: FieldProps<string>) => (
                        <FormControl
                          isInvalid={!!(errors.client && touched.client)}
                        >
                          <FormLabel htmlFor="client">Client</FormLabel>
                          <Input
                            {...field}
                            id="client"
                            placeholder="Center for Architecture"
                          />
                          {errors.client && touched.client ? (
                            <FormErrorMessage lineHeight={'normal'}>
                              {errors.client}
                            </FormErrorMessage>
                          ) : (
                            <FormHelperText>
                              Enter the name of the client (optional).
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    </Field>
                    <Field name="location">
                      {({ field }: FieldProps<string>) => (
                        <FormControl
                          isInvalid={!!(errors.location && touched.location)}
                        >
                          <FormLabel htmlFor="location">Location</FormLabel>
                          <Input
                            {...field}
                            id="location"
                            placeholder="New York City, NY"
                          />
                          {errors.location && touched.location ? (
                            <FormErrorMessage lineHeight={'normal'}>
                              {errors.location}
                            </FormErrorMessage>
                          ) : (
                            <FormHelperText>
                              Enter the location of the project (optional).
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    </Field>
                    <Field name="description">
                      {({ field }: FieldProps<string>) => (
                        <FormControl
                          isInvalid={
                            !!(errors.description && touched.description)
                          }
                        >
                          <FormLabel htmlFor="description">
                            Description
                          </FormLabel>
                          <Textarea {...field} id="description" />
                          {errors.description && touched.description ? (
                            <FormErrorMessage lineHeight={'normal'}>
                              {errors.description}
                            </FormErrorMessage>
                          ) : (
                            <FormHelperText>
                              Enter a description of the project (optional).
                            </FormHelperText>
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
                              'Are you sure you wish to delete this project?'
                            )
                          ) {
                            setIsDeleting(true);
                            try {
                              await props.onDelete();
                              onClose();
                            } catch (error) {
                              setIsDeleting(false);
                              if (error instanceof Error) {
                                toast({
                                  title: error.message,
                                  status: 'error',
                                  isClosable: true,
                                });
                              }
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
}

export default ProjectDrawer;
