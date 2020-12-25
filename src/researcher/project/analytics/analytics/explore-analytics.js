import { userSearchToRegex } from 'shared/utility/user-search-to-regex';
import { observable } from 'aurelia-framework';
import * as d3 from 'd3';
import * as d3Cloud from 'd3-v4-cloud';
import { AnalyticsClient } from '2020-analytics';

export class ExploreAnalytics {
  static inject = [AnalyticsClient];

  constructor(analyticsClient) {
    this.analyticsClient = analyticsClient;
  }

  cache = { wordClouds: {} };
  @observable searchText;
  @observable selectedVerbatims;

  async activate(params) {
    this.projectId = params.projectId;
    this.accountId = params.accountId;
    this.jobId = params.jobId;
    this.selectedVerbatims = [];
    this.filteredVerbatims = [];

    this.analyticsCreateUrl = `/#/projects/${this.projectId}/analytics`;

    if (this.jobId === undefined) {
      return;
    }

    this.featureOutputJob = await this.getConceptExtractionJob();
  }

  attached() {
    if (this.jobId === undefined) {
      return;
    }

    this.conceptDonutChart();
  }

  verbatimNavigationUrl(verbatim) {
    let responseUri;
    if (verbatim.externalRootVerbatimId) {
      responseUri = `responseId=${verbatim.externalRootVerbatimId}&followupId=${verbatim.externalVerbatimId}`;
    } else {
      responseUri = `responseId=${verbatim.externalVerbatimId}`;
    }

    return `/#/projects/${verbatim.externalProjectId}/individual-activities/${verbatim.eventId}/?taskId=${verbatim.promptId}&userId=${verbatim.userId}&${responseUri}`;
  }

  searchTextChanged(newValue) {
    if (!newValue) {
      this.selectedVerbatims.forEach(v => { v.highlightedHtml = null; });
      this.filteredVerbatims = this.selectedVerbatims.concat();
      return;
    }

    this.filteredVerbatims = this.selectedVerbatims
      .filter(v => {
        const regex = userSearchToRegex(newValue);
        const isMatch = v.text.match(regex);
        if (!isMatch) {
          return false;
        }

        v.highlightedHtml = v.text.replace(regex, '<em class="search-highlight">$&</em>');
        return true;
      });
  }

  selectedVerbatimsChanged() {
    this.searchTextChanged(this.searchText, this.searchText);
  }

  conceptDonutChart() {
    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const arc = d3.arc()
      .innerRadius(radius - 95)
      .outerRadius(radius - 10);

    const pie = d3.pie()
      .value(() => 25)
      .sort(null);

    const svg = d3.select('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${radius},${radius})`);

    const g = svg.selectAll('.arc')
      .data(pie(this.featureOutputJob.featureOutput.features))
      .enter().append('g')
      .attr('class', 'arc')
      .on('click', (d, i, nodes) => {
        if (this.currentIndex === i) {
          return;
        }
        svg.selectAll('.arc').classed('selected', false);
        nodes[i].classList.add('selected');
        const parent = nodes[i].parentElement;
        parent.removeChild(nodes[i]);
        parent.appendChild(nodes[i]);

        this.currentIndex = i;
        this.wordCloud(
          i,
          this.featureOutputJob.featureOutput.features[i].keywords,
        );
        this.selectedVerbatims =
          this.featureOutputJob.featureOutput.features[i].verbatims;
      });

    g.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => getSentimentColor(this.featureOutputJob.featureOutput.features[i].sentiment));

    g.append('text')
      .attr('transform', (d) => `translate(${arc.centroid(d)})`)
      .attr('dy', '.35em')
      .style('text-anchor', 'middle')
      .style('font-weight', 'bold')
      .style('fill', 'rgba(0,0,0,.6)')
      .text((d, i) => this.featureOutputJob.featureOutput.features[i]
        .keywords[0].text.toUpperCase());
  }

  async getConceptExtractionJob() {
    return this.analyticsClient
      .getFeatureExtractionOutputJob(this.projectId, this.jobId, false);
  }

  wordCloud(key, keywords) {
    const draw = (words, layout) => {
      d3.select('.word-cloud')
        .append('svg')
        .attr('width', layout.size()[0])
        .attr('height', layout.size()[1])
        .attr('viewBox', '0 0 300 300')
        .attr('preserveAspectRatio', 'xMinYMid')
        .append('g')
        .attr('transform', `translate(${layout.size()[0] / 2},${
          layout.size()[1] / 2})`)
        .selectAll('text')
        .data(words)
        .enter()
        .append('text')
        .style('font-size', (d) => `${d.size}px`)
        .style('font-family', 'Impact')
        .style('fill', (d, i) => getSentimentColor(keywords[i].sentiment))
        .attr('text-anchor', 'middle')
        .attr('class', 'word')
        .attr('transform', (d) => `translate(${[d.x, d.y]})rotate(${
          d.rotate})`)
        .text((d) => d.text)
        .on('click', (d, i) => {
          this.searchText = keywords[i].text;
        });


      // .on('click', function (d) {
      //     $('#tblVerbatims').DataTable().search(d.text).draw();
      // });
    };

    d3.select('.word-cloud').select('svg').remove();

    if (this.cache.wordClouds[key]) {
      // do something
      d3.select('.word-cloud')
        .append(() => this.cache.wordClouds[key].node());
      return;
    }

    const layout = d3Cloud.cloud()
      .size([300, 300])
      .words(keywords.map((d) => ({ text: d.text, size: 35 })))
      .padding(5)
      .rotate(() => 0)
      .font('Impact')
      .fontSize((d) => d.size)
      .on('end', words => {
        draw(words, layout);
        this.cache.wordClouds[key] = d3.select('.word-cloud > svg');
      });

    layout.start();
  }

  getVerbatimSentimentColorString(verbatim) {
    return `background-color: ${getSentimentColor(verbatim.sentiment)}`;
  }

  getSentimentTooltipString(sentiment) {
    if (sentiment < -0.6) {
      return 'Very Negative';
    } else if (sentiment < -0.3) {
      return 'Negative';
    } else if (sentiment < -0.1) {
      return 'Slightly Negative';
    } else if (sentiment < 0.1) {
      return 'Neutral';
    } else if (sentiment < 0.3) {
      return 'Slightly Positive';
    } else if (sentiment < 0.6) {
      return 'Positive';
    }
    return 'Very Positive';
  }
}

function getSentimentColor(sentiment) {
  if (sentiment < -0.9) {
    return '#A60000';
  } else if (sentiment < -0.8) {
    return '#B32313';
  } else if (sentiment < -0.7) {
    return '#BF2615';
  } else if (sentiment < -0.6) {
    return '#CC2816';
  } else if (sentiment < -0.5) {
    return '#D92B17';
  } else if (sentiment < -0.4) {
    return '#D92B17';
  } else if (sentiment < -0.3) {
    return '#E62D19';
  } else if (sentiment < -0.2) {
    return '#F3301A';
  } else if (sentiment < -0.1) {
    return '#FF321C';
  } else if (sentiment < 0.1) {
    return '#cacaca';
  } else if (sentiment < 0.20) {
    return '#B7E698';
  } else if (sentiment < 0.3) {
    return '#B0D998';
  } else if (sentiment < 0.4) {
    return '#A5CC8F';
  } else if (sentiment < 0.5) {
    return '#9BBF86';
  } else if (sentiment < 0.6) {
    return '#91B37D';
  } else if (sentiment < 0.7) {
    return '#86A674';
  } else if (sentiment < 0.8) {
    return '#7C996B';
  } else if (sentiment < 0.9) {
    return '#728C62';
  }
  return '#677F59';
}
