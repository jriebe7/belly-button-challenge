// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let selected_meta = metadata.filter(md => md.id == sample);
    let result = selected_meta[0];
    console.log(result);
    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    // When appending to the demoInfo Box set the key to be in upper case.
    let entries = Object.entries(result);
    
    entries.forEach(([key,value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });
  });
};

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples_data = data.samples;
  
    // Filter the samples for the object with the desired sample number
    let filtered_data = samples_data.filter(sd => sd.id == sample);
    let result = filtered_data[0];
    
    // Get the otu_ids, otu_labels, and sample_values
    let otu_id = result.otu_ids;
    let otu_label = result.otu_labels;
    let samp_value = result.sample_values;
    
    
    // Build a Bubble Chart
    let bubble_data = [{
      x: otu_id,
      y: samp_value,
      text: otu_label,
      mode: 'markers',
      marker:{
          color: otu_id,
          colorscale: 'Earth',
          size: samp_value,
      }
    }];
    let bubble_layout = {
      title: 'Bacteria Culters per Sample',
      height: 600,
      width: 1500 
  };

    // Render the Bubble Chart
  Plotly.newPlot('bubble', bubble_data, bubble_layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    
    let bar_data = [{
      type: 'bar',
      x: samp_value.slice(0,10).reverse(),
      y: otu_id.slice(0,10).map(id => `OTU ${id}`).reverse(),
      text: otu_label.reverse(),
      orientation: 'h'
    }];
  
    let bar_layout = {
    title: 'Top 10 Bacteria Culters Found',
    height: 500,
    width: 1000            
  };    

    // Render the Bar Chart
  Plotly.newPlot('bar', bar_data, bar_layout);
})};


// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;
    console.log(names);

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select('#selDataset');

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < data.names.length; i++) {
      dropdownMenu.append("option").attr("value", data.names[i]).text(data.names[i]);
    };

    // Get the first sample from the list
    let first_sample = names[0];
    console.log(first_sample)
    // Build charts and metadata panel with the first sample
    buildCharts(first_sample)
    buildMetadata(first_sample)
  })
};


// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  console.log(`Subject ID # Changed: ${newSample}`);
  buildCharts(newSample);
  buildMetadata(newSample);
  console.log("Chart updated");
  
};

// Initialize the dashboard
init()