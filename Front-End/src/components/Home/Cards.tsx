
import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Button from '@mui/material/Button';
import useResponsive from '../../hooks/useResponsive';

interface CardItem {
  id: number;
  image_url: string;
  allergen: string;
  description: string;
}

const ActionAreaCard: React.FC = () => {
  const { isSmallScreen } = useResponsive();
  const [cardData, setCardData] = useState<CardItem[]>([]);
  const [visibleCards, setVisibleCards] = useState<number>(10); // Initially show 6 cards

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/card.json');
        const data = await response.json();
        setCardData(data);
      } catch {
        console.log('Error fetching data');
      }
    };
    fetchData();
  }, []);

  // Handle the "Show More" button click
  const handleShowMore = () => {
    setVisibleCards((prev) => prev + 6); // Load more 6 cards each time
  };

return (
  <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    alignContent: 'flex-start', // Align content starting from the top
    justifyContent: 'center', // Start cards from the left
    width: '100%', // Ensure full width of the container
  }}>
    {cardData.slice(0, visibleCards).map((card: CardItem) => (
      <Card key={card.id} sx={{ maxWidth: 250, minWidth: isSmallScreen ? 0 : 250 }}>
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
    
    {visibleCards < cardData.length && (
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Button variant="contained" onClick={handleShowMore} sx={{ marginTop: 2 }}>
          Show More
        </Button>
      </div>
    )}
  </div>
);
}
export default ActionAreaCard;

