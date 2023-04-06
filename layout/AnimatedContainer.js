import { Container } from "@mui/material";
import { animated } from "@react-spring/web";

export default function AnimatedContainer({sx, ...props}) {
  return (
      <Container sx={sx} {...props} />
  );
}