
const contracts_repo = '/home/ed/zkevm-contracts';
const artifact_path = contracts_repo + '/artifacts/contracts';
const deploy_output_file = contracts_repo + '/deployment/deploy_output.json';

const pzkevm = require(artifact_path + '/PolygonZkEVM.sol/PolygonZkEVM.json');
const deploy_output = require(deploy_output_file);
// eg iface_path + '/IPolygonZkEVMBridge.sol/IPolygonZkEVMBridge.json'

const ethers = require('ethers');
//const bytecode = fs.readFileSync('Voting_sol_Voting.bin').toString()
const zkevm_abi = pzkevm.abi;
const zkevm_addr = deploy_output.polygonZkEVMAddress;

const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
const zkinst = new ethers.Contract(zkevm_addr, zkevm_abi, provider);

doQuery(zkinst);

async function doQuery(inst) {

    //mapping(uint64 => bytes32) public forcedBatches;
    //mapping(uint64 => SequencedBatchData) public sequencedBatches;
    //mapping(uint64 => bytes32) public batchNumToStateRoot;
    //mapping(uint256 => PendingState) public pendingStateTransitions;

	const fncs = [
		'matic',
		'rollupVerifier',
		'globalExitRootManager',
		'bridgeAddress',
		'chainID',
		'forkID',
		'verifyBatchTimeTarget',
		'multiplierBatchFee',
		'trustedSequencer',
		'batchFee',
		'lastTimestamp',
		'lastBatchSequenced',
		'lastForceBatchSequenced',
		'lastForceBatch',
		'lastVerifiedBatch',
		'trustedAggregator',
		'trustedSequencerURL',
		'networkName',
		'lastPendingState',
		'lastPendingStateConsolidated',
		'pendingStateTimeout',
		'trustedAggregatorTimeout',
		'admin',
		'pendingAdmin',
		'forceBatchTimeout'
	];

	for (const fn of fncs) {
		const val = await inst.functions[fn]();
		console.log(fn, val);
	}
	return;

	const chainID = 
	console.log('chainID', chainID);
}
/*
  IERC20Upgradeable public immutable matic;
    IVerifierRollup public immutable rollupVerifier;
    IPolygonZkEVMGlobalExitRoot public immutable globalExitRootManager;
    IPolygonZkEVMBridge public immutable bridgeAddress;
    uint64 public immutable chainID;
    uint64 public immutable forkID;
    uint64 public verifyBatchTimeTarget;
    uint16 public multiplierBatchFee;
    address public trustedSequencer;
    uint256 public batchFee;
    mapping(uint64 => bytes32) public forcedBatches;
    mapping(uint64 => SequencedBatchData) public sequencedBatches;
    uint64 public lastTimestamp;
    uint64 public lastBatchSequenced;
    uint64 public lastForceBatchSequenced;
    uint64 public lastForceBatch;
    uint64 public lastVerifiedBatch;
    address public trustedAggregator;
    mapping(uint64 => bytes32) public batchNumToStateRoot;
    string public trustedSequencerURL;
    string public networkName;
    mapping(uint256 => PendingState) public pendingStateTransitions;
    uint64 public lastPendingState;
    uint64 public lastPendingStateConsolidated;
    uint64 public pendingStateTimeout;
    uint64 public trustedAggregatorTimeout;
    address public admin;
    address public pendingAdmin;
    uint64 public forceBatchTimeout;
*/

