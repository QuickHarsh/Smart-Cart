<Card className="h-full glass hover:scale-[1.02] transition-transform duration-300">
  <CardActionArea>
    <CardMedia
      component="img"
      height="200"
      image={product.image}
      alt={product.name}
      className="h-48 object-contain bg-white dark:bg-gray-800 p-4"
    />
    <CardContent>
      <Typography variant="h6" className="font-serif text-gray-900 dark:text-white mb-2 line-clamp-2">
        {product.name}
      </Typography>
      <Typography variant="h5" className="font-serif text-gray-900 dark:text-white mb-2">
        ₹{product.price}
      </Typography>
      <Typography variant="body2" className="text-gray-600 dark:text-gray-300 mb-2">
        {product.description}
      </Typography>
      <div className="flex items-center gap-2">
        <Rating value={product.rating} readOnly precision={0.5} />
        <Typography variant="body2" className="text-gray-900 dark:text-white">
          ({product.reviews} reviews)
        </Typography>
      </div>
    </CardContent>
  </CardActionArea>
  <CardActions className="p-4 pt-0">
    <Button
      variant="contained"
      color="primary"
      fullWidth
      startIcon={<ShoppingCart />}
      className="shadow-glow"
    >
      Add to Cart
    </Button>
  </CardActions>
</Card> 