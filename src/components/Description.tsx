import { Stack, StackProps, Text } from '@chakra-ui/react';

interface DescriptionProps extends StackProps {
  title: string;
  children: React.ReactNode;
}

export const Description = (props: DescriptionProps) => {
  const { title, children, ...rest } = props;
  return (
    <Stack as="dl" spacing="1" {...rest}>
      <Text
        as="dt"
        fontWeight="bold"
        fontSize="xs"
        casing="uppercase"
        color="gray.500"
        whiteSpace="nowrap"
      >
        {title}
      </Text>
      <Text fontSize="sm" fontWeight="medium">
        {children}
      </Text>
    </Stack>
  );
};
