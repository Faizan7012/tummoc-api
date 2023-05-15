const fs = require('fs');

// Define the directory to watch for file changes
const dir = './file.txt';

// Start the event loop
startEventLoop();

function startEventLoop() {
  // Watch the directory for file changes
  const watcher = fs.watch(dir, (eventType, filename) => {
    if (eventType === 'change') {
      console.log(`File ${filename} has been modified.`);
      processFile(filename);
    }
  });

  console.log(`Watching directory ${dir} for file changes...`);

  // Stop the event loop after 60 seconds (optional)
  setTimeout(() => {
    console.log('Stopping event loop.');
    watcher.close();
  }, 60000);
}

function processFile(filename) {
  // Read the contents of the file
  fs.readFile(`${dir}/${filename}`, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file ${filename}: ${err}`);
      return;
    }

    // Process the file contents
    console.log(`Processing file ${filename}:`);
    console.log(data);

    // Perform any additional file processing tasks here

    // Example: Write processed data to a new file
    const processedData = processData(data);
    const outputFilename = `processed_${filename}`;
    fs.writeFile(`${dir}/${outputFilename}`, processedData, 'utf8', (err) => {
      if (err) {
        console.error(`Error writing file ${outputFilename}: ${err}`);
        return;
      }
      console.log(`Processed data written to ${outputFilename}`);
    });
  });
}

function processData(data) {
  // Perform your file processing logic here
  // Example: Convert file contents to uppercase
  return data.toUpperCase();
}