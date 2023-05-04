
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

const dbcfg = {
	'database': 'state_db'
	,'port': 5432
	,'host': 'localhost'
	,'user': 'state_user'
	,'password': 'state_password'
}

doQueries(zkinst, dbcfg);

async function doQueries(inst, dbcfg) {
	console.log('Doing query against PolygonZkEVM contract at ', zkevm_addr);
	await doContractQuery(inst);
	console.log('Doing query against state database');
	await doDBQuery(dbcfg);
}

async function doContractQuery(inst) {

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

    call_results = {};

	for (const fn of fncs) {
		const val = await inst.functions[fn]();
        call_results[fn] = val;
	}

    console.log(call_results);

    const first_val = await inst.functions.batchNumToStateRoot(0);
    console.log('first batchNumToStateRoot', 0, first_val);
    const last_batch = call_results['lastBatchSequenced'].toString()
    const last_val = await inst.functions.batchNumToStateRoot(parseInt(last_batch));
    console.log('last batchNumToStateRoot', last_batch, last_val);

	return;
}

async function doDBQuery(cfg) {
	const { Client } = require("pg")
	const client = new Client({
		user: cfg.user,
		host: cfg.host,
		database: cfg.database,
		password: cfg.password,
		port: cfg.port
	})
	await client.connect()
	const res = await client.query({
		'text': 'select * from state.l2block',
		'rowmode': 'array'
	});
	await client.end()
	console.log(res.rows);
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

