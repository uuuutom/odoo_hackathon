export const generateAssetId = async (Asset) => {
  const latestAsset = await Asset.findOne()
    .sort({ createdAt: -1 })
    .select("assetId");

  if (!latestAsset || !latestAsset.assetId) {
    return "AST-000001";
  }

  const lastNumber = parseInt(latestAsset.assetId.split("-")[1], 10);

  const nextNumber = (lastNumber + 1).toString().padStart(6, "0");

  return `AST-${nextNumber}`;
};
