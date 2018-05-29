import AlgoDescContainer from './algo_desc_container';
import PoissonSample from './poisson_disc_generator';

export default class PoissonDescContainer extends AlgoDescContainer {
  constructor() {
    const title = "Poisson Disc Sampling";
    const description = "A poisson disc sample accomplishes tight, random packing of" +
                       " samples by placing new samples within a distance (2r)" +
                       " of an existing sample, while also ensuring that the sample isn't" +
                       " within distance (r) of any other.  This demo implements such a" +
                       " sample using Bridson's algorithm.  In this algorithm, each new sample" +
                       " is added to a list of active samples.  For each new sample to be drawn," +
                       " an existing sample is selected at random from this list, and from this" +
                       " reference point, new candidates are drawn at random within a circular annulus" +
                       " between r and 2r of this point.  If a new candidate also isn't within" +
                       " r distance of any other point, it becomes a sample and is added to the active list." +
                       " In order to significantly reduce the search for potential conflicts, " +
                       " a reference grid is used to store all sample points." +
                       " If a specified number of candidates have been drawn from the reference point" +
                       " without a valid one being found, the reference point is removed from the active samples " +
                       " list.  The algorithm concludes once the active samples list is empty.";
    const demoSample = new PoissonSample(400, 600, 10, 20);
    super(title, description, demoSample);
  }
}
