import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@material-ui/core";

function NFTCard({ props }) {
  let artNFTaddress = "0x1Fe03B49cA7952F4d4b769DCc2c27AA36da13701";
  const [tokenAddress, setTokenAddress] = useState("");
  const [NFTinfo, setNFTinfo] = useState({
    URI: "",
    description: "",
    external_url: "",
    location: "",
    name: "",
    tag: "",
    type: "",
    token_address: "",
    Artist: "",
  });

  const getPath = () => {
    if (NFTinfo.token_address === artNFTaddress) {
      return `/artorder/${NFTinfo.NFTid}`;
    } else {
      return `/sell/${NFTinfo.NFTid}`;
    }
  };

  useEffect(() => {
    setNFTinfo({
      Hash: props.Hash,
      NFTid: props.NFTid,
      URI: "https://ipfs.io/ipfs/" + props.Hash,
      description: props.description,
      external_url: props.external_url,
      location: props.location,
      name: props.name,
      tag: props.tag,
      type: props.type,
      youtube_url: props.youtube_url,
      amount: props.amount,
      token_address: props.token_address,
      Artist: props.Artist,
    });
    setTokenAddress(props.token_address);
  }, []);

  return (
    <Grid item xs={12} lg={3} className="img_column_market">
      <Card className="dashboard_card">
        <CardActionArea>
          <Link
            to={{
              pathname:
                NFTinfo.token_address === artNFTaddress.toLowerCase()
                  ? `/artorder/${NFTinfo.NFTid}`
                  : `/sell/${NFTinfo.NFTid}`,
              nft: NFTinfo,
            }}
          >
            <CardMedia
              component={NFTinfo.type?.includes("image") ? "img" : "video"}
              controls
              muted
              alt={NFTinfo.name}
              style={{ objectFit: "contain" }}
              image={NFTinfo?.URI}
              title={NFTinfo.name}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h5">
                {NFTinfo?.name}
              </Typography>
              <Typography color="textSecondary" variant="h5" component="h5">
                {NFTinfo?.Artist}
              </Typography>
            </CardContent>
          </Link>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

export default NFTCard;
