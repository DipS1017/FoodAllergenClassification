
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import cardData from './card.json'; // Adjust the path as needed
import useResponsive from '../../hooks/useResponsive';


interface CardItem {
  id: number;
  image_url: string;
  allergen: string;
  description: string;
}

const ActionAreaCard: React.FC = () => {
  const {isSmallScreen,}=useResponsive();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px',alignContent:'center',justifyContent:'center' }}>
      {cardData.map((card: CardItem) => (
        <Card key={card.id} sx={{ maxWidth: 250,minWidth:isSmallScreen ? 0:250 }}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="140"
              image={card.image_url} // Ensure this matches your JSON key
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {card.allergen} 
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {card.description} 
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </div>
  );
};

export default ActionAreaCard;

