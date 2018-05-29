import AlgoDescContainer from './algo_desc_container';

export default class UniformRandomDescContainer extends AlgoDescContainer {
  constructor() {
    const title = "Uniform Random";
    const description = "With a uniform random sample, new samples" +
                       " are generated at random within" +
                       " the specified dimensions";
    super(title, description);
  }
}
