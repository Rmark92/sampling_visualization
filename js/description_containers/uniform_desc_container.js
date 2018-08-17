import AlgoDescContainer from './algo_desc_container';

export default class UniformDescContainer extends AlgoDescContainer {
  constructor() {
    const title = "Grid";
    const description = "With a standard grid formation, points" +
                        " are simply generated at a fixed distance and angle" +
                        " from existing points.  This is perhaps the most straightforward" +
                        " distribution, but these strict patterns can often clash" +
                        " and create an aliasing effect";
    super(title, description);
  }
}
