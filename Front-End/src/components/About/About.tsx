import {Grid, Container, Grow, Paper, Typography } from "@mui/material";
import {
  TextTypography,
} from "../Theme/StyledComponents";
import { useState } from "react";
function About() {
  const [checked, useChecked] = useState(true);
  return (

    <Grid container justifyContent="center">
    <Grow in={checked}>
    
          <Paper elevation={10}
        sx={{
          width:'80%',
          padding: "3%",
          margin:'1%',
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <TextTypography  sx={{ padding: "1%" ,fontWeight:600 ,textTransform:'uppercase'}}>
          Welcome to our Food Allergen Classification System!
        </TextTypography>
        <TextTypography>
          At the forefront of food safety and health, we are dedicated to
          providing innovative solutions for allergen detection through advanced
          technology. <br/>Our state-of-the-art system leverages the power of
          Convolutional Neural Networks (CNNs) to analyze and classify food
          items based on their allergen content.
        </TextTypography>
        <TextTypography  sx={{ padding: "1%" ,fontWeight:600 ,textTransform:'uppercase'}}>
          What We Do{" "}
        </TextTypography>
        <TextTypography>
          Our system is built on cutting-edge machine learning techniques,
          specifically CNNs, which are known for their exceptional performance
          in image classification tasks. <br/>Here's how our technology works:
          <ul>
            <li>
              Data Collection: We have curated a comprehensive dataset
              comprising thousands of food images, each labeled with allergen
              information.
            </li>
            <li>
              Protect Individuals: Ensure that people with food allergies can
              make safe choices and avoid potential allergens.
            </li>
            
          </ul>{" "}
        </TextTypography>
        <TextTypography  sx={{ padding: "1%",fontWeight:600 ,textTransform:'uppercase'}}>
          Why It Matters
        </TextTypography>
        <TextTypography>
          Food allergies can have severe consequences if not managed properly.
          Our system empowers food manufacturers, restaurants, and consumers to
          make informed decisions about food safety.<br/> By integrating our
          technology into various platforms, we are helping to:
          <TextTypography>
            <ul>
              <li>
                Protect Individuals: Ensure that people with food allergies can
                make safe choices and avoid potential allergens.
              </li>
              
              <li>
                Advance Research: Support ongoing research in food safety and
                allergen detection.
              </li>
            </ul>
          </TextTypography>
        </TextTypography>
        <TextTypography  sx={{ padding: "1%" ,fontWeight:600,textTransform:'uppercase' }}>
          Our Vision
        </TextTypography>
        <TextTypography>
          We envision a world where food safety is guaranteed, and individuals
          with food allergies can confidently enjoy their meals without fear.<br/>
          Our team is committed to continuous improvement and innovation,
          striving to enhance the accuracy and efficiency of our allergen
          classification system.
        </TextTypography>
        <TextTypography>
          Thank you for visiting our page. We are excited to be part of the
          journey towards a safer and more informed food industry. <br/>If you have
          any questions or would like to learn more about our technology, feel
          free to contact us.
        </TextTypography>
      </Paper>
    </Grow>
    </Grid>
  );
}

export default About;
