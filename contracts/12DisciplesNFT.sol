// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFV2WrapperConsumerBase.sol";

contract The12Disciples is ERC721, Ownable, VRFV2WrapperConsumerBase {

  event RequestSent(uint256 requestId, uint32 numWords);
  event RequestFulfilled(
      uint256 requestId,
      uint256[] randomWords,
      uint256 payment
  );

  struct MintRequest {
    address minter;
    uint256 amount;
  }

  struct RequestStatus {
      uint256 paid; // amount paid in link
      bool fulfilled; // whether the request has been successfully fulfilled
      uint256[] randomWords;
      MintRequest mintRequest;
  }

  mapping(uint256 => RequestStatus) public s_requests;

  uint256[] public requestIds;
  uint256 public lastRequestId;

  uint32 callbackGasLimit = 100000;
  uint16 requestConfirmations = 3;
  uint32 numWords = 1;

  address public linkAddress;

  bool public publicMinting = false;
  uint256 maxMint = 3;
  string public baseUri;
  uint256 public maxJesusMinted;
  uint256 public jesusMints;

  constructor(
    string memory _name,
    string memory _symbol,
    string memory _baseUri,
    address _linkAddress,
    address _wrapperAddress
  )
  ERC721(_name, _symbol)
  VRFV2WrapperConsumerBase(_linkAddress, _wrapperAddress)
  {
    linkAddress = _linkAddress;
    baseUri = _baseUri;
  }

  function switchMinting() public onlyOwner {
    publicMinting = !publicMinting;
  }

  function mint(uint32 _amount) external returns (uint256 requestId) {
    require(publicMinting, "Owner has not enabled the NFT to be publicly minted.");
    require(_amount <= maxMint, "You have exceeded the amount per mint.");

    requestId = requestRandomness(
      callbackGasLimit,
      requestConfirmations,
      _amount
    );

    s_requests[requestId] = RequestStatus({
      paid: VRF_V2_WRAPPER.calculateRequestPrice(callbackGasLimit),
      randomWords: new uint256[](0),
      fulfilled: false,
      mintRequest: MintRequest({
        minter: msg.sender,
        amount: _amount
      })
    });

    requestIds.push(requestId);
    lastRequestId = requestId;
    
    emit RequestSent(requestId, numWords);
    return requestId;
  }

  function fulfillRandomWords(uint256 _requestId, uint256[] memory _randomWords) internal override {
    require(s_requests[_requestId].paid > 0, "request not found");

    s_requests[_requestId].fulfilled = true;
    s_requests[_requestId].randomWords = _randomWords;

    address minter = s_requests[_requestId].mintRequest.minter;
    uint256 amount = s_requests[_requestId].mintRequest.amount;

    for (uint256 i=0; i<=amount; i++) {
      if (_randomWords[i] % 1000 == 0 && maxJesusMinted <= 10) {
        _safeMint(minter, 0);
        jesusMints++;
      }
      else {
        _safeMint(minter, (_randomWords[i] % 11) + 1);
      }
    }

    emit RequestFulfilled(
      _requestId,
      _randomWords,
      s_requests[_requestId].paid
    );
  }

  function getRequestStatus(uint256 _requestId) external view
    returns (uint256 paid, bool fulfilled, uint256[] memory randomWords) {
    require(s_requests[_requestId].paid > 0, "request not found");
    RequestStatus memory request = s_requests[_requestId];
    return (request.paid, request.fulfilled, request.randomWords);
  }

  function withdrawLink() public onlyOwner {
    LinkTokenInterface link = LinkTokenInterface(linkAddress);
    require(
      link.transfer(msg.sender, link.balanceOf(address(this))),
      "Unable to transfer"
    );
  }

  function withdraw() public payable onlyOwner {
    (bool os, ) = payable(owner()).call{value: address(this).balance}("");
    require(os, "Withdraw failed.");
  }

  function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
    require(
      _exists(_tokenId),
      "ERC721Metadata: URI query for nonexistent token"
    );

    string memory currentBaseURI = _baseURI();
    return bytes(currentBaseURI).length > 0
      ? string(abi.encodePacked(currentBaseURI, "/", Strings.toString(_tokenId), ".json"))
      : "";
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return baseUri;
  }

  // The following functions are overrides required by Solidity.
  function _burn(uint256 tokenId) internal override(ERC721) {
      super._burn(tokenId);
  }
}
