const pincodeInput = document.getElementById('pincodeInput');
    const lookupBtn = document.getElementById('lookupBtn');
    const filterInput = document.getElementById('filterInput');
    const filterContainer = document.getElementById('filterContainer');
    const loader = document.getElementById('loader');
    const errorDiv = document.getElementById('error');
    const resultsDiv = document.getElementById('results');
    
    let allPostOffices = [];
    
    // Validate pincode (6 digits)
    function isValidPincode(pincode) {
      return /^\d{6}$/.test(pincode);
    }
    
    // Fetch pincode data
    async function fetchPincodeData(pincode) {
      try {
        loader.style.display = 'block';
        errorDiv.textContent = '';
        resultsDiv.innerHTML = '';
        
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();
        
        if (data[0].Status === 'Error') {
          throw new Error(data[0].Message);
        }
        
        if (!data[0].PostOffice || data[0].PostOffice.length === 0) {
          throw new Error('No post offices found for this pincode');
        }
        
        allPostOffices = data[0].PostOffice;
        filterContainer.style.display = 'block';
        renderResults(allPostOffices);
      } catch (error) {
        errorDiv.textContent = error.message;
        filterContainer.style.display = 'none';
        resultsDiv.innerHTML = '';
      } finally {
        loader.style.display = 'none';
      }
    }
    
    // Render results
    function renderResults(postOffices) {
      if (postOffices.length === 0) {
        resultsDiv.innerHTML = '<div class="no-results">Couldn\'t find the postal data you\'re looking for...</div>';
        return;
      }
      
      resultsDiv.innerHTML = postOffices.map(postOffice => `
        <div class="post-office-card">
          <h3>${postOffice.Name}</h3>
          <p><strong>Pincode:</strong> ${postOffice.Pincode}</p>
          <p><strong>District:</strong> ${postOffice.District}</p>
          <p><strong>State:</strong> ${postOffice.State}</p>
          <p><strong>Division:</strong> ${postOffice.Division}</p>
          <p><strong>Region:</strong> ${postOffice.Region}</p>
        </div>
      `).join('');
    }
    
    // Filter post offices by name
    function filterPostOffices(searchTerm) {
      const filtered = allPostOffices.filter(postOffice => 
        postOffice.Name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      renderResults(filtered);
    }
    
    // Event listeners
    lookupBtn.addEventListener('click', () => {
      const pincode = pincodeInput.value.trim();
      
      if (!isValidPincode(pincode)) {
        errorDiv.textContent = 'Please enter a valid 6-digit pincode';
        filterContainer.style.display = 'none';
        resultsDiv.innerHTML = '';
        return;
      }
      
      fetchPincodeData(pincode);
    });
    
    filterInput.addEventListener('input', (e) => {
      filterPostOffices(e.target.value);
    });
    
    // Allow only numbers in pincode input
    pincodeInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });