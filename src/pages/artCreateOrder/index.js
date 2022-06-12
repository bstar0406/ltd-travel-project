import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  createOrder,
  approveNFT1155Art,
  isApprovedNFT1155Art,
} from "blockchain/blockchain-functions/newMarket";
// import {
//   approveNFT1155,
//   isApprovedNFT1155,
// } from "blockchain/blockchain-functions/marketFunctions";
import "./index.scss";
import {
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  TextareaAutosize,
  InputLabel,
  FormControl,
  Select,
  Box,
  CircularProgress,
} from "@material-ui/core";
import TrvlCalculator from "./components/trvlCalculator";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "../../redux/data/dataActions";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

export default function SellPage(props) {
  let { id } = useParams();
  const dispatch = useDispatch();
  const classes = useStyles();
  const [isApproved, setIsApproved] = useState(false);
  const [amountToSell, setAmountToSell] = useState(1);
  const [price, setPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [metaverse, setMetaverse] = useState(false);

  const [isCharging, setIsCharging] = useState(false);
  const balanceNFT = useSelector((state) => state.data.userArtNFTs);
  const [NFTinfo, setNFTinfo] = useState({
    Artist: "",
    NFTid: "",
    URI: "",
    description: "",
    external_url: "",
    location: "",
    name: "",
    type: "",
    youtube_url: "",
    amount: "",
    certificate: "",
    typeOfExperience: "",
    aboutArtist: "",
    AboutWork: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const tokensAccepted = [
    {
      name: "BUSD",
      address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    },
    {
      name: "BNB",
      address: "0x0000000000000000000000000000000000000000",
    },
  ];

  const handleSelectChange = async (_id) => {
    setIsCharging(true);
    let selectedNFT = balanceNFT.find((nft) => nft.token_id === _id);
    // let amount = "10";
    let amount = selectedNFT.amount;

    setNFTinfo({ ...selectedNFT.NFTdetails[0], amount });
    setIsCharging(false);
  };

  const handleAmountChange = (num) => {
    let amount = NFTinfo.amount;
    if (Number(num) > amount) {
      setAmountToSell(amount);
    } else if (Number(num) < 0) {
      setAmountToSell(0);
    } else {
      setAmountToSell(num);
    }
  };

  const handleCreate = async () => {
    setIsLoading(true);
    if (props.location.nft?.metaverse?.length) {
      setMetaverse(true);
    } else {
      setMetaverse(false);
    }
    let result = await createOrder(
      NFTinfo.token_address,
      paymentMethod,
      NFTinfo.NFTid,
      amountToSell,
      price
    );
    dispatch(getUserData());
    setIsLoading(false);
  };

  let getData = async () => {
    if (balanceNFT.length === 0) {
      await dispatch(getUserData());
    } else if (id) {
      handleSelectChange(id);
    }
  };

  const handleApprove = async () => {
    setIsLoading(true);
    let result = await approveNFT1155Art();
    if (result) {
      checkApproval();
    }
    setIsLoading(false);
  };

  const checkApproval = async () => {
    let result = await isApprovedNFT1155Art();
    if (result) {
      setIsApproved(result);
    }
  };

  useEffect(() => {
    getData();
    checkApproval();
  }, []);

  return (
    <Paper className="form_content">
      <Typography variant="h5">Sell Art Experiences</Typography>
      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          lg={4}
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          className="img_column"
        >
          <Typography variant="h5">
            {`${NFTinfo.location} - ${NFTinfo.name}`}
          </Typography>
          <Box
            style={{
              width: "300px",
              height: "300px",
              display: "grid",
              placeItems: "center",
            }}
          >
            {NFTinfo.URI === "" && (
              <Typography variant="h6">Select an Asset to Sell</Typography>
            )}
            {isCharging ? (
              <CircularProgress />
            ) : NFTinfo.type?.includes("image") ? (
              <img
                style={{ maxWidth: "90%", "max-height": "90%" }}
                src={"https://ipfs.io/ipfs/" + NFTinfo.Hash}
                alt={NFTinfo.name}
              />
            ) : (
              <video
                controls
                muted
                style={{ maxWidth: "90%", maxHeight: "90%" }}
                src={"https://ipfs.io/ipfs/" + NFTinfo.Hash}
                alt={NFTinfo.name}
              />
            )}
          </Box>
          <Box className="highlight_text">
            <Typography varient="p">
              <a
                href={`https://bscscan.com/address/${NFTinfo.token_address}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Token Address {NFTinfo.token_address}
              </a>
            </Typography>
            <Typography varient="p">
              <a
                href={NFTinfo.certificate}
                target="_blank"
                rel="noopener noreferrer"
              >
                Certificate of Authenticity
              </a>
            </Typography>
            <br />
            <Typography varient="p">Token ID {NFTinfo.NFTid}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} lg={8}>
          <Grid container>
            <Grid xs={12} lg={6} className="column">
              <form className={classes.root} noValidate autoComplete="off">
                <FormControl variant="outlined" className="select_feild">
                  <InputLabel htmlFor="outlined-age-native-simple"></InputLabel>
                  <Select
                    native
                    onChange={(e) => handleSelectChange(e.target.value)}
                    defaultValue="Select Asset to sell"
                  >
                    <option value="Select Asset to sell" disabled>
                      Select Asset to sell
                    </option>
                    {balanceNFT.map((nft) => {
                      return (
                        <option
                          as="Link"
                          key={nft?.token_id}
                          value={nft?.token_id}
                          to={{
                            pathname: `/sell/${nft.token_id}`,
                          }}
                        >
                          {nft?.NFTdetails[0].name}
                        </option>
                      );
                    })}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  style={{ marginBottom: "15px" }}
                  value={`Units available to sell: ${NFTinfo.amount}`}
                  variant="outlined"
                  className="text_feild"
                  placeholder="Price Per Unit for Sale Now in TRVL"
                />

                <TextField
                  fullWidth
                  value={amountToSell}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  type="number"
                  variant="outlined"
                  className="text_feild"
                  placeholder="Amount to Sell"
                />
                <FormControl variant="outlined" className="select_feild">
                  <InputLabel htmlFor="outlined-age-native-simple"></InputLabel>
                  <Select
                    native
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    defaultValue="Select Asset to sell"
                  >
                    <option value="Select Asset to sell" disabled>
                      Select payment token
                    </option>
                    {tokensAccepted.map((token, index) => {
                      return (
                        <option key={index} value={token.address}>
                          {token.name}
                        </option>
                      );
                    })}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  disabled={paymentMethod === ""}
                  value={price}
                  type="number"
                  onChange={(e) => {
                    setPrice(e.target.value);
                  }}
                  variant="outlined"
                  className="text_feild"
                  placeholder={
                    paymentMethod === ""
                      ? "Select a payment method"
                      : `Price Per Unit in ${
                          tokensAccepted.find(
                            (i) => i.address === paymentMethod
                          )?.name
                        }`
                  }
                />
                <TextField
                  fullWidth
                  value={NFTinfo.Artist}
                  type="text"
                  variant="outlined"
                  className="text_feild"
                  placeholder="Artist Name"
                />
                <TextareaAutosize
                  aria-label="minimum height"
                  className="textarea_feild"
                  value={NFTinfo.typeOfExperience}
                  placeholder="Description and Comments"
                />
                <TextareaAutosize
                  aria-label="minimum height"
                  className="textarea_feild"
                  value={NFTinfo.aboutArtist}
                  placeholder="Description and Comments"
                />
                <TextareaAutosize
                  aria-label="minimum height"
                  className="textarea_feild"
                  value={NFTinfo.aboutWork}
                  placeholder="Description and Comments"
                />
              </form>
              {isApproved ? (
                <Button
                  disabled={isLoading}
                  variant="contained"
                  size="medium"
                  color="primary"
                  className="darkbtn"
                  onClick={handleCreate}
                >
                  {isLoading ? "Loading..." : "SUBMIT FOR SALE"}
                </Button>
              ) : (
                <Button
                  disabled={isLoading}
                  variant="contained"
                  size="medium"
                  color="primary"
                  className="darkbtn"
                  onClick={handleApprove}
                >
                  {isLoading ? "Loading..." : "Approve"}
                </Button>
              )}
            </Grid>
            <TrvlCalculator props={NFTinfo} />
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
