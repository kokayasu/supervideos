import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Title({ title }: { title: string }) {
  return (
    <Typography variant="h2" my={2}>
      <Box
        component="span"
        sx={{
          backgroundColor: "secondary.main",
          marginRight: "8px",
          display: "inline-block",
          width: "8px",
          height: "30px",
          verticalAlign: "middle",
        }}
      />
      {title}
    </Typography>
  );
}
