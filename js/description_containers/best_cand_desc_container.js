import AlgoDescContainer from './algo_desc_container';
import BestCandidateSample from '../disc_generators/best_candidate_disc_generator';

export default class BestCandDescContainer extends AlgoDescContainer {
  constructor() {
    const title = "Mitchell's Best Candidate";
    const description = "For each new sample placed, the best candidate" +
                       " algorithm draws a specified number of candidates" +
                       " at random, and selects the candidate with the largest" +
                       " distance from existing samples." +
                       " The algorithm yields a more even distribution" +
                       " of samples than a uniform random distribution, but this" +
                       " comes at the cost of having to check nearest neighbor distance" +
                       " for each candidate.  For quicker determination of nearest neighbor" +
                       " this implementation leverages a quadtree.";
     const demoSample = new BestCandidateSample(400, 600, 100, 10);
     super(title, description, demoSample);
  }
}
